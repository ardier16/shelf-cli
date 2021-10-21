"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackClient = exports.SLACK_SCOPES = void 0;
var web_api_1 = require("@slack/web-api");
var config_1 = require("../config");
exports.SLACK_SCOPES = Object.freeze([
    'identify',
    'channels:history',
    'im:history',
    'channels:read',
    'groups:read',
    'search:read',
    'users:read',
    'chat:write',
]);
exports.slackClient = new web_api_1.WebClient(config_1.config.slackToken);
