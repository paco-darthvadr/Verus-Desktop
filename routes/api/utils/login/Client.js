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
exports.Client = void 0;
var vdxf_1 = require("../vdxf");
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(client) {
        var _this = _super.call(this, vdxf_1.CLIENT_VDXF_KEY) || this;
        _this.client_id = client.client_id;
        _this.name = client.name;
        _this.redirect_uris = client.redirect_uris;
        _this.grant_types = client.grant_types;
        _this.response_types = client.response_types;
        _this.scope = client.scope;
        _this.audience = client.audience;
        _this.owner = client.owner;
        _this.policy_uri = client.policy_uri;
        _this.allowed_cors_origins = client.allowed_cors_origins;
        _this.tos_uri = client.tos_uri;
        _this.client_uri = client.client_uri;
        _this.logo_uri = client.logo_uri;
        _this.contacts = client.contacts;
        _this.client_secret_expires_at = client.client_secret_expires_at;
        _this.subject_type = client.subject_type;
        _this.token_endpoint_auth_method = client.token_endpoint_auth_method;
        _this.userinfo_signed_response_alg = client.userinfo_signed_response_alg;
        _this.created_at = client.created_at;
        _this.updated_at = client.updated_at;
        return _this;
    }
    Client.prototype.stringable = function () {
        return {
            vdxfkey: this.vdxfkey,
            client_id: this.client_id,
            name: this.name,
            redirect_uris: this.redirect_uris,
            grant_types: this.grant_types,
            response_types: this.response_types,
            scope: this.scope,
            audience: this.audience,
            owner: this.owner,
            policy_uri: this.policy_uri,
            allowed_cors_origins: this.allowed_cors_origins,
            tos_uri: this.tos_uri,
            client_uri: this.client_uri,
            logo_uri: this.logo_uri,
            contacts: this.contacts,
            client_secret_expires_at: this.client_secret_expires_at,
            subject_type: this.subject_type,
            token_endpoint_auth_method: this.token_endpoint_auth_method,
            userinfo_signed_response_alg: this.userinfo_signed_response_alg,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    };
    return Client;
}(vdxf_1.VDXFObject));
exports.Client = Client;
