function Proxy(address, port) {
    this._address = address;
    this._port = port;

    /* This indicates on the last time (timestamp) this proxy was used */
    this._lastUsedTime = 0;
}

Proxy.prototype.toString = function () {
    return this._address + ":" + this._port;
};

module.exports = Proxy;