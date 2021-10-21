"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRegex = void 0;
function matchRegex(input, regex) {
    var matches = input.match(regex);
    if (matches === null)
        return '';
    return matches.length > 0 ? matches[1] : '';
}
exports.matchRegex = matchRegex;
