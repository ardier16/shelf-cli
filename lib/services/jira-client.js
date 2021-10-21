"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jiraClient = exports.JIRA_HOST = void 0;
var jira_js_1 = require("jira.js");
var config_1 = require("../config");
exports.JIRA_HOST = 'https://shelf.atlassian.net';
exports.jiraClient = new jira_js_1.Version2Client({
    host: exports.JIRA_HOST,
    authentication: {
        basic: {
            email: config_1.config.jiraEmail,
            apiToken: config_1.config.jiraToken,
        },
    },
});
