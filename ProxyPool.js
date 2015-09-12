function ProxyPool(config) {
    this.initialize(config);
}


ProxyPool.prototype.initialize = function (config) {
    this._dataAccess = config.dataAccess;
    this._minimumProxySleepTime = config.minimumProxySleepTime;
};

ProxyPool.prototype.getProxy = function (successCallback, errorCallback) {

    var currentTimeStamp = Date.now();
    var maxProxyLastUsedTime = Date.now() - this._minimumProxySleepTime;

    var successfulDbQuery = function (proxy) {
        this._dataAccess.updateProxyLastUsedTime(proxy, currentTimeStamp);
        successCallback(proxy)
    };

    this._dataAccess.getProxy(maxProxyLastUsedTime, successfulDbQuery, errorCallback);
};


module.exports = ProxyPool;