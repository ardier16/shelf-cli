"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var promises_1 = require("fs/promises");
var chalk_1 = __importDefault(require("chalk"));
var clear_1 = __importDefault(require("clear"));
var inquirer_1 = __importDefault(require("inquirer"));
var node_1 = require("@gitbeaker/node");
var web_api_1 = require("@slack/web-api");
var jira_js_1 = require("jira.js");
var config_1 = require("../config");
var slack_client_1 = require("../services/slack-client");
var jira_client_1 = require("../services/jira-client");
var spinner_1 = require("../services/spinner");
var commander_1 = require("commander");
var INIT_QUESTIONS = [
    {
        type: 'input',
        name: 'gitlabToken',
        message: 'Gitlab access token',
        suffix: '\nhttps://docs.gitlab.com/ee/user/profile/personal_access_tokens.html\n',
    },
    {
        type: 'input',
        name: 'slackToken',
        message: 'Slack access token',
        suffix: "\nhttps://api.slack.com/authentication/basics\nRequired scopes: " + JSON.stringify(slack_client_1.SLACK_SCOPES, null, 2) + "\n",
    },
    {
        type: 'input',
        name: 'jiraEmail',
        message: 'Jira email',
        suffix: '\n',
    },
    {
        type: 'input',
        name: 'jiraToken',
        message: 'Jira access token',
        suffix: '\nhttps://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/\n',
    },
];
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var isOk, config, isValid, isDone;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isOk = false;
                    config = Object.assign({}, config_1.config);
                    _a.label = 1;
                case 1:
                    (0, clear_1.default)();
                    return [4 /*yield*/, promptConfig(config)];
                case 2:
                    config = _a.sent();
                    return [4 /*yield*/, checkServices(config)];
                case 3:
                    isValid = _a.sent();
                    if (!isValid)
                        return [3 /*break*/, 5];
                    console.log(JSON.stringify(config, null, 2));
                    return [4 /*yield*/, inquirer_1.default.prompt({
                            name: 'isDone',
                            type: 'confirm',
                            default: true,
                            message: 'Update config file?',
                        })];
                case 4:
                    isDone = (_a.sent()).isDone;
                    isOk = isDone;
                    _a.label = 5;
                case 5:
                    if (!isOk) return [3 /*break*/, 1];
                    _a.label = 6;
                case 6:
                    saveConfig(config);
                    (0, clear_1.default)();
                    console.log(chalk_1.default.green('CLI config updated successfully!'));
                    commander_1.program.outputHelp();
                    return [2 /*return*/];
            }
        });
    });
}
exports.init = init;
function promptConfig(config) {
    return __awaiter(this, void 0, void 0, function () {
        var result, _i, INIT_QUESTIONS_1, item, answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = Object.assign({}, config_1.config);
                    _i = 0, INIT_QUESTIONS_1 = INIT_QUESTIONS;
                    _a.label = 1;
                case 1:
                    if (!(_i < INIT_QUESTIONS_1.length)) return [3 /*break*/, 4];
                    item = INIT_QUESTIONS_1[_i];
                    console.log(chalk_1.default.cyan('Shelf CLI initalization'));
                    return [4 /*yield*/, inquirer_1.default.prompt(__assign(__assign({}, item), { default: config[item.name] || result[item.name] }))];
                case 2:
                    answers = _a.sent();
                    if (answers[item.name] !== '') {
                        Object.assign(result, answers);
                    }
                    (0, clear_1.default)();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, result];
            }
        });
    });
}
function saveConfig(config) {
    return __awaiter(this, void 0, void 0, function () {
        var newConfig, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newConfig = __assign(__assign({}, config_1.config), config);
                    output = JSON.stringify(newConfig, null, 2);
                    return [4 /*yield*/, (0, promises_1.writeFile)(config_1.CONFIG_PATH, output)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function checkServices(config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, isGitlabValid, isJiraValid, isSlackValid, isValid, isContinue;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    spinner_1.spinner.start('Checking services');
                    return [4 /*yield*/, Promise.all([
                            checkGitlab(config),
                            checkJira(config),
                            checkSlack(config),
                        ])];
                case 1:
                    _a = _b.sent(), isGitlabValid = _a[0], isJiraValid = _a[1], isSlackValid = _a[2];
                    isValid = isGitlabValid && isJiraValid && isSlackValid;
                    if (isValid) {
                        spinner_1.spinner.succeed();
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, inquirer_1.default.prompt({
                            name: 'isContinue',
                            type: 'confirm',
                            default: true,
                            message: 'Try again?',
                        })];
                case 2:
                    isContinue = (_b.sent()).isContinue;
                    if (!isContinue) {
                        process.exit();
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
function checkGitlab(config) {
    return __awaiter(this, void 0, void 0, function () {
        var gitlabClient, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (config.gitlabToken === '')
                        throw new Error();
                    gitlabClient = new node_1.Gitlab({ token: config.gitlabToken });
                    return [4 /*yield*/, gitlabClient.Users.current()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_1 = _a.sent();
                    spinner_1.spinner.fail();
                    console.error(chalk_1.default.red('Invalid Gitlab token'));
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function checkJira(config) {
    return __awaiter(this, void 0, void 0, function () {
        var jiraClient, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (config.jiraEmail === '' || config.jiraToken === '')
                        throw new Error();
                    jiraClient = new jira_js_1.Version2Client({
                        host: jira_client_1.JIRA_HOST,
                        authentication: {
                            basic: {
                                email: config.jiraEmail,
                                apiToken: config.jiraToken,
                            },
                        },
                    });
                    return [4 /*yield*/, jiraClient.jiraSettings.getConfiguration()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_2 = _a.sent();
                    spinner_1.spinner.fail();
                    console.error(chalk_1.default.red('Invalid Jira email:token pair'));
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function checkSlack(config) {
    return __awaiter(this, void 0, void 0, function () {
        var slackClient, response_1, isSlackScopesValid, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (config.slackToken === '')
                        throw new Error();
                    slackClient = new web_api_1.WebClient(config.slackToken);
                    return [4 /*yield*/, slackClient.api.test()];
                case 1:
                    response_1 = _a.sent();
                    isSlackScopesValid = slack_client_1.SLACK_SCOPES
                        .every(function (scope) { var _a, _b; return (_b = (_a = response_1.response_metadata) === null || _a === void 0 ? void 0 : _a.scopes) === null || _b === void 0 ? void 0 : _b.includes(scope); });
                    if (isSlackScopesValid)
                        return [2 /*return*/, true];
                    spinner_1.spinner.fail();
                    console.error(chalk_1.default.red('Invalid Slack scopes. Required:'));
                    console.error(chalk_1.default.red(JSON.stringify(slack_client_1.SLACK_SCOPES, null, 2)));
                    return [2 /*return*/, false];
                case 2:
                    err_3 = _a.sent();
                    spinner_1.spinner.fail();
                    console.error(chalk_1.default.red('Invalid Slack token'));
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
