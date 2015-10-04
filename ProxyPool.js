function ProxyPool(config) {
    this.initialize(config);
}


ProxyPool.prototype.initialize = function (config) {
    this._dataAccess = config.dataAccess;
    this._minimumProxySleepTime = config.minimumProxySleepTime;
};

ProxyPool.prototype.addProxy = function (proxy, callback) {

    var currentPool = this;
    this._dataAccess.isProxyExists(proxy, function (error, proxyFromDb) {
        if (error) {
            callback(error);
            return;
        }
        if (proxyFromDb) {
            /* Proxy was already in db. */
            callback(null, Object.convertToProxy(proxyFromDb))
        }
        else {
            /* Proxy was just added to db */
            currentPool._dataAccess.addProxy(proxy, callback);
        }
    })
};

ProxyPool.prototype.getProxy = function (callback) {

    var currentTimeStamp = Date.now();
    var maxProxyLastUsedTime = Date.now() - this._minimumProxySleepTime;
    var currentPool = this;

    var dbCallback = function (error, proxy) {
        if (error) {
            callback(error);
            return;
        }

        currentPool._dataAccess.updateProxyLastUsedTime(proxy, currentTimeStamp);
        callback(null, proxy)
    };

    this._dataAccess.getProxy(maxProxyLastUsedTime, dbCallback);
};

ProxyPool.prototype.markProxyInactive = function (proxy) {
    this._dataAccess.markProxyInactive(proxy);
};


module.exports = ProxyPool;