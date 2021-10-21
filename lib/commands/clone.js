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
exports.clone = void 0;
var chalk_1 = __importDefault(require("chalk"));
var clear_1 = __importDefault(require("clear"));
var inquirer_1 = __importDefault(require("inquirer"));
var git_client_1 = require("../services/git-client");
var gitlab_client_1 = require("../services/gitlab-client");
var spinner_1 = require("../services/spinner");
function clone(search) {
    return __awaiter(this, void 0, void 0, function () {
        var projects, project, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!search) {
                        console.log(chalk_1.default.red("Please provide " + chalk_1.default.cyan('[search]') + " param"));
                        process.exit(0);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    spinner_1.spinner.start("Searching for projects: " + chalk_1.default.yellow(search));
                    return [4 /*yield*/, gitlab_client_1.gitlabClient.Projects.all({
                            membership: true,
                            perPage: 100,
                            search: search,
                        })];
                case 2:
                    projects = _a.sent();
                    spinner_1.spinner.succeed();
                    (0, clear_1.default)();
                    return [4 /*yield*/, inquirer_1.default.prompt({
                            type: 'list',
                            name: 'project',
                            message: 'Choose GitLab Project',
                            choices: projects.map(function (item) { return ({
                                name: chalk_1.default.yellow(item.name) + " (" + item.path_with_namespace + ")",
                                value: item,
                            }); }),
                        })];
                case 3:
                    project = (_a.sent()).project;
                    spinner_1.spinner.start('Cloning GitLab repository');
                    return [4 /*yield*/, git_client_1.gitClient.clone(project.ssh_url_to_repo)];
                case 4:
                    _a.sent();
                    spinner_1.spinner.succeed();
                    console.log("Project " + chalk_1.default.yellow(project.name) + " " + chalk_1.default.green('successfully cloned'));
                    console.log('\nNavigate to project directory:');
                    console.log(chalk_1.default.cyan("cd " + project.path + "\n"));
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    spinner_1.spinner.fail();
                    console.error(chalk_1.default.red(err_1));
                    process.exit(0);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.clone = clone;
