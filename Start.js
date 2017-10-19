var MongoAccess = require('./DataAccess/MongoAccess');
var ProxyPoolConfiguration = require('./ProxyPoolConfiguration');
var ProxyPool = require('./ProxyPool');
var Proxy = require('./Proxy');
var config = require('./config');


var mongoDbDataAccess = new MongoAccess(config.dbConnectionString, "proxies");
var poolConfig = new ProxyPoolConfiguration(mongoDbDataAccess, config.minimumProxySleepTime);
var pool = new ProxyPool(poolConfig);

var addingProxyCallback = function(err, proxy) {
    if (err) {
        console.log(err);
        return;
    }

    console.log(proxy + " Added");
};
var gettingProxyCallback = function(err, proxy) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("proxy: " + proxy._address);
};

var addProxy = function(address, port) {
    proxy = new Proxy(address, port);

    pool.addProxy(proxy, addingProxyCallback);
};

proxy = new Proxy("123.30.75.116", "3128");

var currentTimeStamp = Date.now();
pool.updateProxy(proxy, { _lastCheckedTime: 1.0 }, function(err,proxyFromDB) {
        console.log("here");
    })
    // pool.reportProxyActivity(proxy);

//addProxy("202.22.195.193", "1080");

//addProxy("190.109.164.81", "1080");

// pool.getProxy(gettingProxyCallback);