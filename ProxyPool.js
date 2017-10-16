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

        currentPool._dataAccess.updateProxy(proxy, { _lastUsedTime: currentTimeStamp }, callback);
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
    console.warn("This function is DEPRECATED and will be removed in the next versions of proxy-pool. Please use  ")
    this.updateProxy(proxy, { _active: active });
};

ProxyPool.prototype.updateProxyLastCheckTime = function(proxy, lastCheckedTime, callback) {
    console.warn("This function is DEPRECATED and will be removed in the next versions of proxy-pool. Please use  ")
    this.updateProxy(proxy, { _lastCheckedTime: lastCheckedTime }, callback);
};

ProxyPool.prototype.updateProxy = function(proxy, newProps, callback) {
    this._dataAccess.updateProxy(proxy, newProps, callback);
}


module.exports = ProxyPool;