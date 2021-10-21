"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitlabClient = void 0;
var node_1 = require("@gitbeaker/node");
var config_1 = require("../config");
exports.gitlabClient = new node_1.Gitlab({
    token: config_1.config.gitlabToken,
});
