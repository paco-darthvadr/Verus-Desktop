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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
var Decision_1 = require("./Decision");
var vdxf_1 = require("../vdxf");
var Response = /** @class */ (function (_super) {
    __extends(Response, _super);
    function Response(response) {
        var _this = _super.call(this, vdxf_1.RESPONSE_VDXF_KEY) || this;
        _this.chain_id = response.chain_id;
        _this.signing_id = response.signing_id;
        _this.decision = new Decision_1.Decision(response.decision);
        if (response.signature) {
            _this.signature = new vdxf_1.VerusIDSignature(response.signature);
        }
        return _this;
    }
    Response.prototype.getSignedData = function () {
        return this.decision.toString();
    };
    Response.prototype.stringable = function () {
        return {
            vdxfkey: this.vdxfkey,
            chain_id: this.chain_id,
            signature: this.signature,
            signing_id: this.signing_id,
            decision: this.decision.stringable()
        };
    };
    return Response;
}(vdxf_1.VDXFObject));
exports.Response = Response;
