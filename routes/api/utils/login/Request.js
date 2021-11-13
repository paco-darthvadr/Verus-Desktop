"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
var crypto = require('crypto');
var Request = /** @class */ (function () {
    function Request(uuid, timestamp, service_id_address) {
        this.uuid = uuid;
        this.timestamp = timestamp;
        this.service_id_address = service_id_address;
    }
    Request.prototype.isValid = function () {
        return this.uuid != null && this.timestamp != null && this.service_id_address != null;
    };
    Request.prototype.hash = function () {
        return crypto
            .createHash("sha256")
            .update(this.uuid)
            .update(this.timestamp.toString())
            .update(this.service_id_address)
            .digest()
            .toString('hex');
    };
    Request.prototype.toJson = function () {
        return {
            uuid: this.uuid,
            timestamp: this.timestamp,
            service_id_address: this.service_id_address
        };
    };
    return Request;
}());
exports.Request = Request;
