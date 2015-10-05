# JSProxyPool

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

#### markProxyInactive
```js
/* Marks the given proxy inactive. */
markProxyInactive (proxy);
```
This method marks the given proxy as inactive and will not be used any more.

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

#### markProxyInactive
Marks the proxy as inactive to never use it again. Call this function if the proxy is not working any more.
```js
pool.markProxyInactive(proxy);
```

### Helpers

If you don't have any proxies to fill the pool with, it is recommended to refer [Refill-Proxy-Pool](https://github.com/maryum375/refill-proxy-pool) library in order to fill the pool with free proxies.
>Simple NodeJS code that uses HMA-Proxy-Scraper and Xroxy-Proxy-Scraper to scrape free proxies and insert them to the JSProxyPool db.

## License


MIT



**Feel free to fork and contribute :)**
