"use strict";
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
exports.sendMRToSlack = void 0;
var chalk_1 = __importDefault(require("chalk"));
var clear_1 = __importDefault(require("clear"));
var inquirer_1 = __importDefault(require("inquirer"));
var git_client_1 = require("../services/git-client");
var gitlab_client_1 = require("../services/gitlab-client");
var slack_client_1 = require("../services/slack-client");
var spinner_1 = require("../services/spinner");
var gitlab_1 = require("../utils/gitlab");
function sendMRToSlack(search) {
    return __awaiter(this, void 0, void 0, function () {
        var conversation, branchName, project, mergeRequests, mergeRequest, messageNotifier, message, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!search) {
                        console.log(chalk_1.default.red("Please provide " + chalk_1.default.cyan('[search]') + " param"));
                        process.exit(0);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, chooseSlackConversation(search)];
                case 2:
                    conversation = _a.sent();
                    if (conversation === undefined) {
                        console.log(chalk_1.default.red("No Slack conversations found for " + search));
                        process.exit(0);
                    }
                    return [4 /*yield*/, git_client_1.gitClient.getCurrentBranch()];
                case 3:
                    branchName = _a.sent();
                    return [4 /*yield*/, (0, gitlab_1.getGitlabProject)()];
                case 4:
                    project = _a.sent();
                    spinner_1.spinner.start("Finding open merge request for " + chalk_1.default.yellow(branchName));
                    return [4 /*yield*/, gitlab_client_1.gitlabClient.MergeRequests.all({
                            projectId: project.id,
                            sourceBranch: branchName,
                            targetBranch: 'master',
                            state: 'opened',
                        })];
                case 5:
                    mergeRequests = _a.sent();
                    if (mergeRequests.length === 0) {
                        spinner_1.spinner.fail();
                        console.log(chalk_1.default.red("No opened merge requests found for " + branchName));
                        process.exit(0);
                    }
                    spinner_1.spinner.succeed();
                    mergeRequest = mergeRequests[0];
                    if (!mergeRequest.title.startsWith('WIP:')) return [3 /*break*/, 7];
                    mergeRequest.title = mergeRequest.title.replace('WIP: ', '');
                    spinner_1.spinner.start('Removing merge request WIP badge');
                    return [4 /*yield*/, gitlab_client_1.gitlabClient.MergeRequests.edit(project.id, mergeRequest.iid, {
                            title: mergeRequest.title,
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    spinner_1.spinner.succeed().start('Sending message to Slack');
                    messageNotifier = conversation.isChannel ? '<!here> ' : '';
                    message = composeIssueMessage(messageNotifier + "*" + mergeRequest.title + "*\n<" + mergeRequest.web_url + ">");
                    return [4 /*yield*/, slack_client_1.slackClient.chat.postMessage({
                            channel: conversation.id,
                            text: message,
                        })];
                case 8:
                    _a.sent();
                    spinner_1.spinner.succeed();
                    console.log(chalk_1.default.green('Message is successfully sent to Slack'));
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _a.sent();
                    spinner_1.spinner.fail();
                    console.error(chalk_1.default.red(err_1));
                    process.exit(0);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.sendMRToSlack = sendMRToSlack;
function composeIssueMessage(message) {
    var TASK_REGEX = /((SHF-\d+))/;
    var TASK_LINK_REPLACER = '<https://shelf.atlassian.net/browse/$1|$1>';
    return message.replace(TASK_REGEX, TASK_LINK_REPLACER);
}
function searchSlackConversations(search) {
    return __awaiter(this, void 0, void 0, function () {
        var conversations, channels, mapped, members, mapped;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conversations = [];
                    spinner_1.spinner.start("Searching Slack channels: " + chalk_1.default.yellow(search));
                    return [4 /*yield*/, slack_client_1.slackClient.conversations.list({ limit: 100 })];
                case 1:
                    channels = (_a.sent()).channels;
                    if (channels !== undefined) {
                        mapped = channels.map(function (item) { return ({
                            id: item.id || '',
                            name: item.name || '',
                            fullName: item.name || '',
                            displayName: item.name || '',
                            isChannel: true,
                        }); });
                        conversations.push.apply(conversations, mapped);
                    }
                    spinner_1.spinner.succeed().start("Searching Slack members: " + chalk_1.default.yellow(search));
                    return [4 /*yield*/, slack_client_1.slackClient.users.list({ limit: 100 })];
                case 2:
                    members = (_a.sent()).members;
                    if (members !== undefined) {
                        mapped = members
                            .filter(function (item) { return !item.deleted; })
                            .map(function (item) {
                            var _a;
                            return ({
                                id: item.id || '',
                                name: item.name || '',
                                displayName: ((_a = item.profile) === null || _a === void 0 ? void 0 : _a.display_name) || item.name || '',
                                fullName: item.real_name || '',
                                isChannel: false,
                            });
                        });
                        conversations.push.apply(conversations, mapped);
                    }
                    spinner_1.spinner.succeed();
                    return [2 /*return*/, conversations.filter(function (item) {
                            var normalizedSearch = search.toLowerCase();
                            return item.name.toLowerCase().includes(normalizedSearch) ||
                                item.fullName.toLowerCase().includes(normalizedSearch) ||
                                item.displayName.toLowerCase().includes(normalizedSearch);
                        })];
            }
        });
    });
}
function chooseSlackConversation(search) {
    return __awaiter(this, void 0, void 0, function () {
        var conversations, conversationId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchSlackConversations(search)];
                case 1:
                    conversations = _a.sent();
                    if (conversations.length === 0)
                        return [2 /*return*/, undefined];
                    (0, clear_1.default)();
                    return [4 /*yield*/, inquirer_1.default.prompt({
                            type: 'list',
                            name: 'conversationId',
                            message: 'Choose Slack conversation',
                            choices: conversations.map(function (item) { return ({
                                name: item.isChannel
                                    ? "#" + item.name
                                    : item.fullName + " (@" + item.displayName + ")",
                                value: item.id,
                            }); }),
                        })];
                case 2:
                    conversationId = (_a.sent()).conversationId;
                    return [2 /*return*/, conversations.find(function (item) { return item.id === conversationId; })];
            }
        });
    });
}
