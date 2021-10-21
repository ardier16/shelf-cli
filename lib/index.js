#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var commander_1 = require("commander");
var figlet_1 = __importDefault(require("figlet"));
var commands_1 = require("./commands");
var config_1 = require("./config");
var autocomplete_1 = require("./utils/autocomplete");
if (process.argv.includes('--init-autocomplete')) {
    (0, autocomplete_1.initAutocomplete)();
    process.exit();
}
commander_1.program
    .name('shelf')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .version(require('../package.json').version)
    .usage('<command> [options]')
    .description('Shelf.Network CLI');
commands_1.COMMANDS.forEach(function (command) {
    commander_1.program
        .command([command.name, command.arguments].join(' ').trim())
        .description(command.description)
        .action(wrapAction(command));
});
if (!process.argv.slice(2).length) {
    var figletBanner = figlet_1.default.textSync('Shelf CLI', {
        horizontalLayout: 'full',
    });
    console.log(chalk_1.default.red(figletBanner));
    commander_1.program.outputHelp();
    process.exit(0);
}
commander_1.program.parse(process.argv);
function wrapAction(command) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var isInitialized = Object.values(config_1.config)
            .every(function (item) { return item !== ''; });
        if (!isInitialized && command.name !== 'init') {
            console.log(chalk_1.default.red('CLI is not initialized yet'));
            console.log("Run " + chalk_1.default.yellow('shelf init') + " to initialize CLI");
            process.exit();
        }
        command.action.apply(command, args);
    };
}
