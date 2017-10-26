var Proxy = require('./Proxy');
var consts = require("./constants");

function ProxyPool(config) {
    this.initialize(config);
}


ProxyPool.prototype.initialize = function(config) {
    this._dataAccess = config.dataAccess;
    this.poolConfiguration = {};
    this.poolConfiguration._minimumProxySleepTime = config.minimumProxySleepTime;
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

ProxyPool.prototype.getProxy = function(options, callback) {
    var currentTimeStamp = Date.now();
    options = setDefaultOptionsValues(options, this.poolConfiguration);
    var currentPool = this;

    var dbCallback = function(error, proxy) {
        if (error) {
            callback(error);
            return;
        }

        currentPool.updateProxy(proxy, { _lastUsedTime: currentTimeStamp }, callback);
    };

    this._dataAccess.getProxy(options, dbCallback);
};

ProxyPool.prototype.getProxies = function(options, callback) {

    options = setDefaultOptionsValues(options, this.poolConfiguration);
    var currentPool = this;

    var dbCallback = function(error, proxies) {
        if (error) {
            callback(error);
            return;
        }

        callback(null, proxies)
    };

    this._dataAccess.getProxies(options, dbCallback);
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

function setDefaultOptionValue(options, optionName, optionValue) {
    if (!options[optionName]) {
        options[optionName] = optionValue;
    }
    return options;
}

function setDefaultOptionsValues(options, poolConfiguration) {
    //Set default to return 1 proxy
    options = setDefaultOptionValue(options, consts.PROXIES_COUNT_OPTION_NAME, consts.PROXIES_COUNT_OPTION_VALUE);

    //Set default to return active proxies
    options = setDefaultOptionValue(options, consts.PROXY_ACTIVITY_OPTION_NAME, consts.PROXY_ACTIVITY_OPTION_VALUE);

    //Set default to the way to sort the returned proxies
    options = setDefaultOptionValue(options, consts.PROXIES_SORTING_OPTION_NAME, consts.PROXIES_SORTING_OPTION_VALUE);

    //Set default to return proxies from last x (configurable) time
    options = setDefaultOptionValue(options, consts.MAX_LAST_USED_TIME_OPTION_NAME, Date.now() - poolConfiguration._minimumProxySleepTime);

    return options;
}


module.exports = ProxyPool;