"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitlabSdk = void 0;
var node_1 = require("@gitbeaker/node");
var config_1 = require("../config");
exports.gitlabSdk = new node_1.Gitlab({
    token: config_1.config.gitlabToken,
});
