"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.CONFIG_PATH = void 0;
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
var defaultConfig = {
    gitlabToken: '',
    slackToken: '',
    jiraEmail: '',
    jiraToken: '',
};
exports.CONFIG_PATH = (0, path_1.resolve)((0, os_1.homedir)(), '.shelfrc');
if (!(0, fs_1.existsSync)(exports.CONFIG_PATH)) {
    (0, fs_1.appendFileSync)(exports.CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
}
var rawConfig = (0, fs_1.readFileSync)(exports.CONFIG_PATH);
exports.config = JSON.parse(rawConfig.toString());
