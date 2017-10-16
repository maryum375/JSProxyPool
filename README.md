# JSProxyPool [![npm version](https://img.shields.io/npm/v/angular2-busy.svg?style=flat-square)](https://npmjs.org/package/proxy-pool) [![npm](https://img.shields.io/npm/dt/proxy-pool.svg?maxAge=25920)](https://www.npmjs.com/package/proxy-pool)
[![NPM](https://nodei.co/npm/proxy-pool.png)](https://npmjs.org/package/proxy-pool)

JSProxyPool is a lightweight and simple NodeJS library that handles the management of a pool of proxies.

  - It handles the db access on its own, fully transparent to the client.
  - Fully compatible to changes and tweaks to match any pool using application.

## Features

* Fully compatible with **various databases**. [will be explained later]
* **Simple** to use and ultra **reliable**
* set a resting interval for a proxy to **prevent overuse** of a single proxy.

## DB compatibility
DataAccess folder contains classes for every database. for now only **MongoDB** is implemented, but feel free to create your own implementation for other databases.

To implement a new database access all you need to do is implement the following functions and it will work like a charm:

#### getProxy
```js
/* Gets a proxy from the database */
getProxy (maxLastUsedTime, callback);
```
Gets a proxy from the database that its last use time was before the ***maxLastUsedTime*** (timestamp).
The method calls the ***callback*** function with error as first parameter and the proxy object as second.

#### getProxies
```js
/* Gets a list of proxies from the database */
getProxies (count, callback);
```
Gets a list of proxies from the database. The amount of proxies in the list will be according to ***count*** (number) parameter.
The method calls the ***callback*** function with error as first parameter and the proxies array object as second.

#### addProxy
```js
/* Adds a new proxy to the database */
addProxy (proxy, callback);
```
Adds a new proxy to the database.
The method calls the ***callback*** function with error as first parameter and the proxy object that was just added as second.


#### updateProxyLastUsedTime
```js
/* Adds a new proxy to the database */
updateProxyLastUsedTime (proxy, usedTime);
```
Updates the given proxy's _lastUsedTime property to the given usedTime.

#### isProxyExists
```js
/* Adds a new proxy to the database */
isProxyExists (proxy, callback);
```
Checks if the proxy exists in the db. The method calls the ***callback*** function  with error as first parameter and the proxy object from the db, if exists.

#### reportProxyActivity
```js
/* Reports the given proxy activity state. */
reportProxyActivity (proxy,active);
```
This method updates the given proxy activity state according to the active paramter. When the proxy is inactive it and will not be used any more for future requests.

## Installation

To add the library to your project just run the npm command:
```sh
$ npm install proxy-pool
```

## Proxy Pool Usage

First require the **proxy-pool** library:
```js
var jsProxyPool = require("proxy-pool");
```
The ProxyPool constructor gets a **ProxyPoolConfiguration** instance as parameter.
ProxyPoolConfiguration contains all the configurations and constants the pool needs to operate.

To create a configuration instance you should first create a data access instance that is used to access the desired db.
The configuration instance constructor gets the data access instance and a number that represents the number of seconds the proxy should rest after it made a request (this is used to not overuse a single proxy).
```js
var mongoDbDataAccess = new jsProxyPool.MongoAccess("myMongoDbConnectionString", "myProxiesCollectionName");
var poolConfig = new jsProxyPool.ProxyPoolConfiguration(mongoDbDataAccess, 20*1000 /* Rest time in milliseconds */);
var pool = new jsProxyPool.ProxyPool(poolConfig);
```

#### addProxy

Adds a new 'Proxy' object to the pool

First create a proxy object to add:
```js
var proxy = new jsProxyPool.Proxy('address', 'port');
```

Then call addProxy:
```js
pool.addProxy (proxy,function (error, proxy){
    if (error){
        /* Code to be executed on error */
        return;
    }
    /* Code to be executed after proxy was added */
});
```

#### getProxy

Gets a new 'Proxy' that is ready to use
```js
pool.getProxy(function (proxy){
    if (error){
        /* Code to be executed on error */
        return;
    }
    /* Code to be executed when we got a proxy from the pool */
});
```
>This method automatically calls **updateProxyLastUsedTime** to set that this proxy was just used to make a request.

#### reportProxyActivity
Updates the proxy active state according to the active parameter. Call this function if the proxy is not working any more.
```js
pool.reportProxyActivity(proxy,active);
```

### Helpers

If you don't have any proxies to fill the pool with, it is recommended to refer [Refill-Proxy-Pool](https://github.com/maryum375/refill-proxy-pool) library in order to fill the pool with free proxies.
>Simple NodeJS code that uses HMA-Proxy-Scraper and Xroxy-Proxy-Scraper to scrape free proxies and insert them to the JSProxyPool db.

## License


MIT



**Feel free to fork and contribute :)**
