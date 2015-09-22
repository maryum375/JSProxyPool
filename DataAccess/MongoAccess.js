var monk = require('monk');
var Proxy = require('../Proxy');

function MongoAccess(mongoConnectionString, proxiesCollectionName) {
    this._monkInstance = monk(mongoConnectionString);
    this._proxiesCollectionName = proxiesCollectionName;
}

MongoAccess.prototype.getProxy = function (maxLastUsedTime, successCallback, errorCallback) {
    var collection = this._monkInstance.get(this._proxiesCollectionName);


    /* Handles proxies find results */
    var findCallback = function (err, docs) {
        if (err) {
            /* Failed to get proxy from db */
            console.log(err);
            errorCallback(err);
			return;
        }

        if (docs !== null && docs.length !== 0) {
            var proxy = docs.sort(Proxy.compare)[0];
            successCallback(proxy);
        }
        else {
            var errorMessage = "No proxy that matches the criteria";
            console.log(errorMessage);
            errorCallback(errorMessage);
        }
    };


    var min = collection.find({
        _lastUsedTime: { $lt: maxLastUsedTime }
    }, findCallback);
    console.log(min);
};

MongoAccess.prototype.updateProxyLastUsedTime = function (proxy, usedTime) {

    if (proxy._lastUsedTime === undefined) {
        throw "argument is not of required type.";
    }

    proxy._lastUsedTime= usedTime;

    var collection = this._monkInstance.get(this._proxiesCollectionName);

    collection.updateById(proxy._id, proxy, function () {
        console.log("_lastUsedTime successfully updated");
    });
};


MongoAccess.prototype.addProxy = function (proxy, successCallback, errorCallback) {
    if (!(proxy instanceof Proxy)) {
        throw "argument is not of required type.";
    }

    var collection = this._monkInstance.get(this._proxiesCollectionName);
    collection.insert(proxy, function (err, doc) {
        if (err) {
            errorCallback(err);
            return;
        }
        if (doc) {
            successCallback(doc);
        }
    });
};


module.exports = MongoAccess;