"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jiraSdk = void 0;
var jira_js_1 = require("jira.js");
var config_1 = require("../config");
exports.jiraSdk = new jira_js_1.Version2Client({
    host: 'https://shelf.atlassian.net',
    authentication: {
        basic: {
            email: config_1.config.jiraEmail,
            apiToken: config_1.config.jiraToken,
        },
    },
});
