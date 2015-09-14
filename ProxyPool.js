function ProxyPool(config) {
    this.initialize(config);
}


ProxyPool.prototype.initialize = function (config) {
    this._dataAccess = config.dataAccess;
    this._minimumProxySleepTime = config.minimumProxySleepTime;
};

ProxyPool.prototype.addProxy = function (proxy,successCallback, errorCallback){
    this._dataAccess.addProxy (proxy,successCallback,errorCallback);
};

ProxyPool.prototype.getProxy = function (successCallback, errorCallback) {

    var currentTimeStamp = Date.now();
    var maxProxyLastUsedTime = Date.now() - this._minimumProxySleepTime;
    var currentPool = this;

    var successfulDbQuery = function (proxy) {
        //TODO This is not the current pool it is something else. Fix it
        currentPool._dataAccess.updateProxyLastUsedTime(proxy, currentTimeStamp);
        successCallback(proxy)
    };

    this._dataAccess.getProxy(maxProxyLastUsedTime, successfulDbQuery, errorCallback);
};


module.exports = ProxyPool;