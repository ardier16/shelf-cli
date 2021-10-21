"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMANDS = void 0;
var init_1 = require("./init");
var log_work_1 = require("./log-work");
var push_mr_1 = require("./push-mr");
var slack_mr_1 = require("./slack-mr");
var clone_1 = require("./clone");
var today_worklog_1 = require("./today-worklog");
exports.COMMANDS = [
    {
        name: 'init',
        description: 'Initialize CLI',
        arguments: '',
        action: init_1.init,
    },
    {
        name: 'clone',
        arguments: '[search]',
        description: 'Search and clone GitLab project',
        action: clone_1.clone,
    },
    {
        name: 'push-mr',
        arguments: '[issueLink]',
        description: 'Create new branch and related merge request',
        action: push_mr_1.pushMergeRequest,
    },
    {
        name: 'slack-mr',
        arguments: '[search]',
        description: 'Send merge request message to Slack',
        action: slack_mr_1.sendMRToSlack,
    },
    {
        name: 'log-work',
        arguments: '[timeSpent]',
        description: 'Log work time for current issue',
        action: log_work_1.logWork,
    },
    {
        name: 'today-worklog',
        arguments: '',
        description: 'Get today\'s total worklog time',
        action: today_worklog_1.getTodayWorklog,
    },
];
