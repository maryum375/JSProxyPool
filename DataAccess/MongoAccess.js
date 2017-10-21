var monk = require('monk');
var Proxy = require('../Proxy');

function MongoAccess(mongoConnectionString, proxiesCollectionName) {
    this._monkInstance = monk(mongoConnectionString);
    this._proxiesCollectionName = proxiesCollectionName;
}

/* Gets a proxy from the database that its last use time was before the maxLastUsedTime (timestamp). */
MongoAccess.prototype.getProxy = function(maxLastUsedTime, callback) {
    return this.getProxies(maxLastUsedTime, 1, function(err, proxies) {
        callback(err, proxies[0])
    });
};

MongoAccess.prototype.getProxies = function(maxLastUsedTime, count, callback) {
    var collection = this._monkInstance.get(this._proxiesCollectionName);

    /* Handles proxies find results */
    var findCallback = function(err, docs) {
        if (err) {
            /* Failed to get proxy from db */
            console.log(err);
            callback(err);
            return;
        }

        if (docs !== null && docs.length >= count) {
            var proxies = docs.sort(Proxy.compare).slice(0, count);
            callback(null, proxies);
        } else {
            var errorMessage = "No proxy that matches the criteria";
            console.log(errorMessage);
            callback(errorMessage);
        }
    };


    collection.find({
        $and: [
            { _lastUsedTime: { $lt: maxLastUsedTime } },
            { _active: true }
        ]
    }, findCallback);
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
            return callback("Failed to update proxy: No such proxy exists");
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