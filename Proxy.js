function Proxy(address, port) {
    this._address = address;
    this._port = port;

    /* This indicates on the last time (timestamp) this proxy was used */
    this._lastUsedTime = 0;
}

Proxy.prototype.toString = function () {
    return this._address + ":" + this._port;
};

Proxy.compare = function (proxy1,proxy2) {
    if (proxy1._lastUsedTime < proxy2._lastUsedTime)
        return -1;
    if (proxy1._lastUsedTime > proxy2._lastUsedTime)
        return 1;
    return 0;
}

module.exports = Proxy;