"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAutocomplete = void 0;
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
var commands_1 = require("../commands");
var COMMANDS_DEFINITION = commands_1.COMMANDS
    .map(function (command) { return "\"" + command.name + ":" + command.description + "\""; })
    .join('\n');
var COMPDEF_SCRIPT = "\n#compdef shelf\n\nlocal -a commands\ncommands=(\n" + COMMANDS_DEFINITION + "\n)\n\n_describe 'command' commands\n";
var ZSH_FUNCTIONS_FPATH = 'fpath=(~/.zsh/functions $fpath)';
var AUTOLOAD_COMMAND = 'autoload -Uz compinit && compinit';
var HOME = (0, os_1.homedir)();
var ZSH_FUNCTIONS_PATH = (0, path_1.resolve)(HOME, '.zsh/functions');
var ZSHRC_PATH = (0, path_1.resolve)(HOME, '.zshrc');
var SHELF_SCRIPT_PATH = (0, path_1.resolve)(ZSH_FUNCTIONS_PATH, '_shelf');
function initAutocomplete() {
    try {
        if (!(0, fs_1.existsSync)(ZSHRC_PATH))
            return;
        if (!(0, fs_1.existsSync)(ZSH_FUNCTIONS_PATH)) {
            (0, fs_1.mkdirSync)(ZSH_FUNCTIONS_PATH, { recursive: true });
        }
        if (!(0, fs_1.existsSync)(ZSH_FUNCTIONS_PATH)) {
            (0, fs_1.mkdirSync)(ZSH_FUNCTIONS_PATH);
        }
        if ((0, fs_1.existsSync)(SHELF_SCRIPT_PATH)) {
            (0, fs_1.writeFileSync)(SHELF_SCRIPT_PATH, COMPDEF_SCRIPT);
        }
        else {
            (0, fs_1.appendFileSync)(SHELF_SCRIPT_PATH, COMPDEF_SCRIPT);
        }
        var zshConfig = (0, fs_1.readFileSync)(ZSHRC_PATH).toString();
        if (!zshConfig.includes(ZSH_FUNCTIONS_FPATH)) {
            zshConfig += "\n" + ZSH_FUNCTIONS_FPATH + "\n";
        }
        if (!zshConfig.includes(AUTOLOAD_COMMAND)) {
            zshConfig += AUTOLOAD_COMMAND + "\n";
        }
        (0, fs_1.writeFileSync)(ZSHRC_PATH, zshConfig);
    }
    catch (err) {
        process.exit();
    }
}
exports.initAutocomplete = initAutocomplete;
