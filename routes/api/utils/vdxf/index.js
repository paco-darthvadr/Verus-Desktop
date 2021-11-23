"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerusIDSignature = exports.VDXFObject = void 0;
var keys_1 = require("./keys");
__exportStar(require("./keys"), exports);
var VDXFObject = /** @class */ (function () {
    function VDXFObject(key) {
        this.vdxfkey = key;
    }
    VDXFObject.prototype.stringable = function () {
        return {};
    };
    VDXFObject.prototype.toString = function () {
        return JSON.stringify(this.stringable());
    };
    return VDXFObject;
}());
exports.VDXFObject = VDXFObject;
var VerusIDSignature = /** @class */ (function (_super) {
    __extends(VerusIDSignature, _super);
    function VerusIDSignature(sig) {
        var _this = _super.call(this, keys_1.VERUSID_SIG_VDXF_KEY) || this;
        _this.signature = sig.signature;
        return _this;
    }
    VerusIDSignature.prototype.stringable = function () {
        return {
            vdxfkey: this.vdxfkey,
            signature: this.signature
        };
    };
    return VerusIDSignature;
}(VDXFObject));
exports.VerusIDSignature = VerusIDSignature;
