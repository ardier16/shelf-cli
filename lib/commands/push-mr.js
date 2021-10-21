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
exports.pushMergeRequest = void 0;
var chalk_1 = __importDefault(require("chalk"));
var git_client_1 = require("../services/git-client");
var gitlab_client_1 = require("../services/gitlab-client");
var jira_client_1 = require("../services/jira-client");
var spinner_1 = require("../services/spinner");
var gitlab_1 = require("../utils/gitlab");
var regex_1 = require("../utils/regex");
var JIRA_ISSUE_REGEX = /https:\/\/shelf\.atlassian\.net\/browse\/(SHF-\d+)/;
function pushMergeRequest(issueLink) {
    return __awaiter(this, void 0, void 0, function () {
        var issueName, issue, project, gitlabUser, mr, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!testIssueLink(issueLink)) {
                        console.log(chalk_1.default.red('Invalid issue link:') + " " + issueLink);
                        console.log("Please follow " + chalk_1.default.cyan('https://shelf.atlassian.net/browse/SHF-XXX') + " format");
                        process.exit(0);
                    }
                    issueName = (0, regex_1.matchRegex)(issueLink, JIRA_ISSUE_REGEX);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    spinner_1.spinner.start("Finding issue " + chalk_1.default.yellow(issueName));
                    return [4 /*yield*/, jira_client_1.jiraClient.issues.getIssue({ issueIdOrKey: issueName })];
                case 2:
                    issue = _a.sent();
                    spinner_1.spinner.succeed();
                    return [4 /*yield*/, (0, gitlab_1.getGitlabProject)()];
                case 3:
                    project = _a.sent();
                    spinner_1.spinner.succeed().start("Creating branch " + chalk_1.default.yellow(issueName));
                    return [4 /*yield*/, git_client_1.gitClient.checkout('master')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, git_client_1.gitClient.createBranch(issueName)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, git_client_1.gitClient.pushOrigin(issueName)];
                case 6:
                    _a.sent();
                    spinner_1.spinner.succeed()
                        .start("Creating merge request for " + chalk_1.default.yellow(issueName));
                    return [4 /*yield*/, gitlab_client_1.gitlabClient.Users.current()];
                case 7:
                    gitlabUser = _a.sent();
                    return [4 /*yield*/, gitlab_client_1.gitlabClient.MergeRequests.create(project.id, issueName, 'master', "WIP: [" + issueName + "] " + issue.fields.summary, {
                            assigneeId: gitlabUser.id,
                            description: issueLink,
                            squash: true,
                            removeSourceBranch: true,
                        })];
                case 8:
                    mr = _a.sent();
                    spinner_1.spinner.succeed();
                    console.log("Merge request created for the issue " + chalk_1.default.yellow(issueName));
                    console.log(chalk_1.default.green(mr.web_url));
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
exports.pushMergeRequest = pushMergeRequest;
function testIssueLink(link) {
    return link !== undefined && JIRA_ISSUE_REGEX.test(link);
}
