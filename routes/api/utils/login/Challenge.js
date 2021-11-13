"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge = void 0;
var crypto = require('crypto');
var Challenge = /** @class */ (function () {
    function Challenge(uuid, timestamp, user_id_address) {
        this.uuid = uuid;
        this.timestamp = timestamp;
        this.user_id_address = user_id_address;
    }
    Challenge.prototype.isValid = function () {
        return this.uuid != null && this.timestamp != null && this.user_id_address != null;
    };
    Challenge.prototype.hash = function () {
        return crypto
            .createHash("sha256")
            .update(this.uuid)
            .update(this.timestamp.toString())
            .update(this.user_id_address)
            .digest()
            .toString('hex');
    };
    Challenge.prototype.toJson = function () {
        return {
            uuid: this.uuid,
            timestamp: this.timestamp,
            user_id_address: this.user_id_address
        };
    };
    return Challenge;
}());
exports.Challenge = Challenge;
