function ProxyPool(config) {
    this.initialize(config);
}


ProxyPool.prototype.initialize = function (config) {
    this._dataAccess = config.dataAccess;
    this._minimumProxySleepTime = config.minimumProxySleepTime;
};


ProxyPool.prototype.getProxy = function () {

    var currentTimeStamp = Date.now();
    var maxProxyLastUsedTime = Date.now() - this._minimumProxySleepTime;

    var proxy = this._dataAccess.getProxy(maxProxyLastUsedTime);
    if (!proxy) {
        throw "No available proxy in db";
    }

    this._dataAccess.updateProxyLastUsedTime(proxy, currentTimeStamp);
};


module.exports = ProxyPool;