var Proxy = require('./Proxy');

function ProxyPool(config) {
    this.initialize(config);
}


ProxyPool.prototype.initialize = function(config) {
    this._dataAccess = config.dataAccess;
    this._minimumProxySleepTime = config.minimumProxySleepTime;
};

ProxyPool.prototype.addProxy = function(proxy, callback) {

    var currentPool = this;
    this._dataAccess.isProxyExists(proxy, function(error, proxyFromDb) {
        if (error) {
            callback(error);
            return;
        }
        if (proxyFromDb) {
            /* Proxy was already in db. */
            callback(null, Proxy.convertToProxy(proxyFromDb))
        } else {
            /* Proxy was just added to db */
            currentPool._dataAccess.addProxy(proxy, callback);
        }
    })
};

ProxyPool.prototype.getProxy = function(callback) {

    var currentTimeStamp = Date.now();
    var maxProxyLastUsedTime = Date.now() - this._minimumProxySleepTime;
    var currentPool = this;

    var dbCallback = function(error, proxy) {
        if (error) {
            callback(error);
            return;
        }

        currentPool._dataAccess.updateProxyLastUsedTime(proxy, currentTimeStamp);
        callback(null, proxy)
    };

    this._dataAccess.getProxy(maxProxyLastUsedTime, dbCallback);
};

ProxyPool.prototype.getProxies = function(count, callback) {

    var currentTimeStamp = Date.now();
    var maxProxyLastUsedTime = Date.now() - this._minimumProxySleepTime;
    var currentPool = this;

    var dbCallback = function(error, proxies) {
        if (error) {
            callback(error);
            return;
        }

        callback(null, proxies)
    };

    this._dataAccess.getProxies(maxProxyLastUsedTime, count, dbCallback);
};

ProxyPool.prototype.reportProxyActivity = function(proxy, active) {
    this._dataAccess.reportProxyActivity(proxy, active);
};

ProxyPool.prototype.updateProxyLastCheckTime = function(proxy, lastCheckedTime, callback) {

    var currentPool = this;
    this._dataAccess.isProxyExists(proxy, function(error, proxyFromDb) {
        if (error) {
            callback(error);
            return;
        }
        if (proxyFromDb) {
            currentPool._dataAccess.updateProxyLastCheckedTime(proxyFromDb, lastCheckedTime);
            callback(null, proxyFromDb);
        } else {
            console.log("Proxy doesn't exist in DB");
            callback("Proxy doesn't exist in DB");
        }
    })
};


module.exports = ProxyPool;