var monk = require('monk');

function MongoAccess(mongoConnectionString, proxiesCollectionName) {
    this._monkInstance = monk(mongoConnectionString);
    this._proxiesCollectionName = proxiesCollectionName;
}

MongoAccess.prototype.getProxy = function (maxLastUsedTime,successCallback,errorCallback) {
    var collection = this._monkInstance.get(this._proxiesCollectionName);

    var findCallback = function (err, docs) {
        if (err) {
            /* Failed to get proxy from db */
            console.log(err);
            errorCallback(err);
        }

        if (docs != null) {
            var proxy = {};/* TODO Get last used proxy */

            successCallback (proxy);
        }
        else {
            var errorMessage = "No proxy that matches the criteria";
            console.log(errorMessage);
            errorCallback(errorMessage);
        }
    };
    var promise = new Promise(function (resolve, reject) {
        collection.find({
            $and: [
                {
                    _lastUsedTime: { $lt: maxLastUsedTime }
                }
            ]
        }, findCallback);
    });
};

MongoAccess.prototype.updateProxyLastUsedTime = function (proxy, usedTime) {

    if (!(proxy instanceof Proxy)) {
        throw "argument is not of required type.";
    }

    //TODO Implement
};


MongoAccess.prototype.addProxy = function (proxy) {
    if (!(proxy instanceof Proxy)) {
        throw "argument is not of required type.";
    }
    //TODO Implement
};


module.exports = MongoAccess;