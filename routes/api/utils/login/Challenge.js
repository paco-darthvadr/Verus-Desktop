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
exports.Challenge = void 0;
var Client_1 = require("./Client");
var vdxf_1 = require("../vdxf");
var Challenge = /** @class */ (function (_super) {
    __extends(Challenge, _super);
    function Challenge(challenge) {
        var _this = _super.call(this, vdxf_1.CHALLENGE_VDXF_KEY) || this;
        _this.uuid = "";
        _this.uuid = challenge.uuid;
        _this.requested_scope = challenge.requested_scope;
        _this.requested_access_token_audience = challenge.requested_access_token_audience;
        _this.skip = challenge.skip;
        _this.subject = challenge.subject;
        _this.oidc_context = challenge.oidc_context;
        _this.request_url = challenge.request_url;
        _this.login_challenge = challenge.login_challenge;
        _this.login_session_id = challenge.login_session_id;
        _this.acr = challenge.acr;
        _this.session_id = challenge.session_id;
        _this.client = new Client_1.Client(challenge.client);
        return _this;
    }
    Challenge.prototype.stringable = function () {
        return {
            vdxfkey: this.vdxfkey,
            uuid: this.uuid,
            client: this.client.stringable(),
            requested_scope: this.requested_scope,
            requested_access_token_audience: this.requested_access_token_audience,
            skip: this.skip,
            subject: this.subject,
            oidc_context: this.oidc_context,
            request_url: this.request_url,
            login_challenge: this.login_challenge,
            login_session_id: this.login_session_id,
            acr: this.acr,
            session_id: this.session_id,
        };
    };
    return Challenge;
}(vdxf_1.VDXFObject));
exports.Challenge = Challenge;
