"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitSdk = exports.GitSdk = void 0;
var child_process_1 = require("child_process");
var GitSdk = /** @class */ (function () {
    function GitSdk() {
    }
    GitSdk.prototype.checkout = function (branch) {
        return this._execCommand("git checkout " + branch);
    };
    GitSdk.prototype.createBranch = function (branch) {
        return this._execCommand("git checkout -b " + branch);
    };
    GitSdk.prototype.getCurrentBranch = function () {
        return this._execCommand('git branch --show-current');
    };
    GitSdk.prototype.pushOrigin = function (branch) {
        return this._execCommand("git push --set-upstream origin " + branch);
    };
    GitSdk.prototype.getRemoteUrl = function () {
        return this._execCommand('git remote get-url --push origin');
    };
    GitSdk.prototype._execCommand = function (command) {
        return new Promise(function (resolve, reject) {
            (0, child_process_1.exec)(command, function (error, stdout, stderr) {
                if (error) {
                    reject(error);
                }
                var output = stdout || stderr || '';
                resolve(output.trim());
            });
        });
    };
    return GitSdk;
}());
exports.GitSdk = GitSdk;
exports.gitSdk = new GitSdk();
