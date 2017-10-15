function Proxy(address, port) {
    this._address = address;
    this._port = port;

    this._active = true;

    /* This indicates on the last time (timestamp) this proxy was used */
    this._lastUsedTime = 0;

    /* This indicates on the last time (timestamp) this proxy was checked */
    this._lastCheckedTime = 0;
}

Proxy.prototype.toString = function() {
    return this._address + ":" + this._port;
};

Proxy.compare = function(proxy1, proxy2) {
    if (proxy1._lastUsedTime < proxy2._lastUsedTime)
        return -1;
    if (proxy1._lastUsedTime > proxy2._lastUsedTime)
        return 1;
    return 0;
};

Proxy.isProxy = function(obj) {
    return (obj.hasOwnProperty("_address") && obj.hasOwnProperty("_port"));

};

Proxy.convertToProxy = function(obj) {
    if (!Proxy.isProxy(obj)) {
        throw "This is not a proxy object. Conversion failed.";
    }

    if (obj.hasOwnProperty("_address") &&
        obj.hasOwnProperty("_port") &&
        obj.hasOwnProperty("_active") &&
        obj.hasOwnProperty("_lastUsedTime")) {
        var p = new Proxy(obj._address, obj._port);
        p._active = obj._active;
        p._lastUsedTime = obj._lastUsedTime;
        return p;
    }

    throw "This object doesn't contain all the properties of a proxy object. Conversion failed.";
};

module.exports = Proxy;