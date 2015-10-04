var monk = require('monk');
var Proxy = require('../Proxy');

function MongoAccess(mongoConnectionString, proxiesCollectionName) {
    this._monkInstance = monk(mongoConnectionString);
    this._proxiesCollectionName = proxiesCollectionName;
}

MongoAccess.prototype.getProxy = function (maxLastUsedTime, callback) {
    var collection = this._monkInstance.get(this._proxiesCollectionName);


    /* Handles proxies find results */
    var findCallback = function (err, docs) {
        if (err) {
            /* Failed to get proxy from db */
            console.log(err);
            callback(err);
            return;
        }

        if (docs !== null && docs.length !== 0) {
            var proxy = docs.sort(Proxy.compare)[0];
            callback(null, proxy);
        }
        else {
            var errorMessage = "No proxy that matches the criteria";
            console.log(errorMessage);
            callback(errorMessage);
        }
    };


    var min = collection.find({
        _lastUsedTime: {$lt: maxLastUsedTime}
    }, findCallback);
};

MongoAccess.prototype.updateProxyLastUsedTime = function (proxy, usedTime) {

    if (proxy._lastUsedTime === undefined) {
        throw "argument is not of required type.";
    }

    proxy._lastUsedTime = usedTime;

    var collection = this._monkInstance.get(this._proxiesCollectionName);

    collection.updateById(proxy._id, proxy, function () {
        console.log("_lastUsedTime successfully updated");
    });
};


MongoAccess.prototype.addProxy = function (proxy, callback) {
    if (!(proxy instanceof Proxy)) {
        throw "argument is not of required type.";
    }

    var collection = this._monkInstance.get(this._proxiesCollectionName);
    collection.insert(proxy, callback);
};


module.exports = MongoAccess;