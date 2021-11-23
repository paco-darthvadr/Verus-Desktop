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
exports.Decision = void 0;
var vdxf_1 = require("../vdxf");
var Request_1 = require("./Request");
var Decision = /** @class */ (function (_super) {
    __extends(Decision, _super);
    function Decision(decision) {
        var _this = _super.call(this, vdxf_1.DECISION_VDXF_KEY) || this;
        _this.subject = decision.subject;
        _this.remember = decision.remember;
        _this.remember_for = decision.remember_for;
        _this.acr = decision.acr;
        _this.context = decision.context;
        _this.force_subject_identifier = decision.force_subject_identifier;
        _this.error = decision.error;
        _this.error_description = decision.error_description;
        _this.error_hint = decision.error_hint;
        _this.error_debug = decision.error_debug;
        _this.status_code = decision.status_code;
        _this.request = new Request_1.Request(decision.request);
        return _this;
    }
    Decision.prototype.stringable = function () {
        return {
            vdxfkey: this.vdxfkey,
            subject: this.subject,
            remember: this.remember,
            remember_for: this.remember_for,
            acr: this.acr,
            context: this.context,
            force_subject_identifier: this.force_subject_identifier,
            error: this.error,
            error_description: this.error_description,
            error_hint: this.error_hint,
            error_debug: this.error_debug,
            status_code: this.status_code,
            request: this.request.stringable(),
        };
    };
    return Decision;
}(vdxf_1.VDXFObject));
exports.Decision = Decision;
