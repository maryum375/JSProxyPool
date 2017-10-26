var monk = require('monk');
var Proxy = require('../Proxy');
var consts = require("../constants");

function MongoAccess(mongoConnectionString, proxiesCollectionName) {
    this._monkInstance = monk(mongoConnectionString);
    this._proxiesCollectionName = proxiesCollectionName;
}

function ConvertOptionsToMongoQuery(options) {
    var queryAndConditions = [];
    if (options[consts.MAX_LAST_USED_TIME_OPTION_NAME]) {
        queryAndConditions.push({ _lastUsedTime: { $lt: options[consts.MAX_LAST_USED_TIME_OPTION_NAME] } })
    }
    if (options[consts.PROXY_ACTIVITY_OPTION_NAME]) {
        queryAndConditions.push({ _active: options[consts.PROXY_ACTIVITY_OPTION_NAME] })
    }
    return queryAndConditions;
}

/* Gets a proxy from the database. */
MongoAccess.prototype.getProxy = function(options, callback) {
    options[consts.PROXIES_COUNT_OPTION_NAME] = 1
    return this.getProxies(options, function(err, proxies) {
        if (err) {
            return callback(err)
        }
        callback(err, proxies[0])
    });
};

MongoAccess.prototype.getProxies = function(options, callback) {
    var collection = this._monkInstance.get(this._proxiesCollectionName);


    /* Handles proxies find results */
    var findCallback = function(err, docs) {
        if (err) {
            /* Failed to get proxy from db */
            console.log(err);
            callback(err);
            return;
        }

        if (docs !== null && docs.length >= 1) {
            callback(null, docs);
        } else {
            var errorMessage = "No proxy that matches the criteria";
            var err = new Error(errorMessage);
            console.log(errorMessage);
            callback(err);
        }
    };

    var queryAndConditions = ConvertOptionsToMongoQuery(options);

    collection.find({
        $and: queryAndConditions
    }, { sort: options[consts.PROXIES_SORTING_OPTION_NAME], limit: options[consts.PROXIES_COUNT_OPTION_NAME] }, findCallback);
}

/* Updates the given proxy with given args. */
MongoAccess.prototype.updateProxy = function(proxy, newProps, callback) {

    this._checkProxyType(proxy);

    var collection = this._monkInstance.get(this._proxiesCollectionName);
    collection.findOneAndUpdate({
        $and: [
            { _address: proxy._address },
            { _port: proxy._port }
        ]
    }, {
        $set: newProps
    }).then((updatedProxy) => {
        if (!updatedProxy) {
            var err = new Error("Failed to update proxy: No such proxy exists")
            return callback(err);
        }
        callback(null, updatedProxy);
    }).catch((err) => {
        console.log("Failed to update proxy: " + err);
        callback(err)
    });
};

/* Adds a new proxy to the database. */
MongoAccess.prototype.addProxy = function(proxy, callback) {
    this._checkProxyType(proxy);

    var collection = this._monkInstance.get(this._proxiesCollectionName);
    collection.insert(proxy, callback);
};

/* Checks if the proxy exists in the db. If exists returns it, else returns false */
MongoAccess.prototype.isProxyExists = function(proxy, callback) {
    this._checkProxyType(proxy);

    var findCallback = function(err, docs) {
        if (err) {
            callback(err);
            return;
        }


        if (docs !== null && docs.length !== 0) {
            callback(null, docs[0]);
        } else {
            callback(null, false);
        }
    };

    var collection = this._monkInstance.get(this._proxiesCollectionName);
    collection.find({
        $and: [
            { _address: proxy._address },
            { _port: proxy._port }
        ]
    }, findCallback);

};

/* Checks if the given object is of type Proxy */
MongoAccess.prototype._checkProxyType = function(proxy) {
    if (!(Proxy.isProxy(proxy))) {
        throw "argument is not of required type.";
        //console.log("argument is not of required type.");
    }
};

module.exports = MongoAccess;