var MongoAccess = require('./DataAccess/MongoAccess');
var ProxyPoolConfiguration = require('./ProxyPoolConfiguration');
var ProxyPool = require('./ProxyPool');
var Proxy = require('./Proxy');
var config = require('./config');


var mongoDbDataAccess = new MongoAccess(config.dbConnectionString, "proxies");
var poolConfig = new ProxyPoolConfiguration(mongoDbDataAccess, config.minimumProxySleepTime);
var pool = new ProxyPool(poolConfig);

var errorCallback = function (err) {
    console.log(err);
};
var success2Callback = function (proxy) {
    console.log("proxy: "+proxy._address);
};

var success1Callback = function (proxy) {
    console.log("proxy: "+proxy._address);
    pool.getProxy(success2Callback, errorCallback);
};

var addProxy = function (address, port) {
    proxy = new Proxy(address, port);

    pool.addProxy(proxy, function () {
        console.log("New proxy added.");
    }, errorCallback);
};

//addProxy("202.22.195.193", "1080");

//addProxy("190.109.164.81", "1080");

pool.getProxy(success1Callback, errorCallback);

