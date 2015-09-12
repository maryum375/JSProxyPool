var MongoAccess = require('./DataAccess/MongoAccess');
var ProxyPoolConfiguration = require('./ProxyPoolConfiguration');
var ProxyPool = require('./ProxyPool');
var config = require('./config');


var minimumProxySleepTime = 20*1000;
var mongoDbDataAccess = new MongoAccess(config.dbConnectionString,"proxies");
var poolConfig = new ProxyPoolConfiguration(mongoDbDataAccess,minimumProxySleepTime);
var pool = new ProxyPool(poolConfig);

var proxy = pool.getProxy();

console.log(proxy);