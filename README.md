# JSProxyPool
---

JSProxyPool is a lightwaight and simple NodeJS library that handles the management of a pool of proxies.

  - It handles the db access on its own, fully transpatent to the client.
  - Fully competible to changes and tweaks to match any pool using application.
---
## Version

0.1 (alpha)

---
## Feachers

* Fully competible to work with **multiple databases**. [will be explained later]
* **Simple** to use and ultra **reliable**
* set a resting interval for a proxy to **prevent overuse** of a single proxy.

---
## DB compatibility
DataAccess folder contains classes for every database. for now only **MongoDB** is implemented, but feel free to implement your own implementation for other databases.

To implement a new database access all you need to do is implement the following functions and it will work like a charm:

#### getProxy
```js
/* Gets a proxy from the database */
getProxy (maxLastUsedTime, successCallback, errorCallback);
```
Gets a proxy from the database that its last use time was before the maxLastUsedTime (timstamp).
The method should call successCallback function on success with the result proxy as parameter, or errorCallback with error message as parameter.

#### addProxy
```js
/* Adds a new proxy to the database */
addProxy (proxy, successCallback, errorCallback);
```
Adds a new proxy to the database.
The method should call successCallback function on success with the proxy that was just added as parameter, or errorCallback with error message as parameter.


#### updateProxyLastUsedTime
```js
/* Adds a new proxy to the database */
updateProxyLastUsedTime (proxy, usedTime);
```
Updates the given proxy's _lastUsedTime property to the given usedTime.

---
## Proxy Pool Usage

The ProxyPool constructor gets a **ProxyPoolConfiguration** instance as parameter.
ProxyPoolConfiguration contains all the configurations and constants the pool needs to operate.

To create a configuration instance you should first create a data access instance that is used to access the desired db.
The configuration instance constructor gets the data access instance and a number that represents the number of seconds the proxy should rest after it made a request (this is used to not overuse a single proxy).
```sh
var mongoDbDataAccess = new MongoAccess("myMongoDbConnectionString", "myProxiesCollectionName");
var poolConfig = new ProxyPoolConfiguration(mongoDbDataAccess, 20*1000 /* Rest time in miliseconds */);
var pool = new ProxyPool(poolConfig);
```

#### addProxy

Adds a new 'Proxy' object to the pool
```js
var proxy = new Proxy('address', 'port');
```

call addProxy
```js
pool.addProxy (proxy,function (proxy){
    /* Code to be executed after proxy was added */
}, function (error){
    /* Code to be executed on error */
});
```

#### getProxy

Gets a new 'Proxy' that is ready to use
```js
pool.getProxy(function (proxy){
    /* Code to be executed after proxy was added */
}, function (error){
    /* Code to be executed on error */
});
```
>This method automatically calls **updateProxyLastUsedTime** to set that this proxy was just used to make a request.

#### deleteProxy
Not implemented yet, Will be implemented soon.

---
License
----


MIT

----


**Feel free to fork and contribute :)**
