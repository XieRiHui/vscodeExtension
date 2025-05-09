"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionNode = getFunctionNode;
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
function getFunctionNode(code, index) {
    let functionNode;
    const ast = (0, parser_1.parse)(code);
    (0, traverse_1.default)(ast, {
        FunctionDeclaration(path) {
            if (index >= path.node?.start && index <= path.node?.end) {
                functionNode = {
                    name: path.node?.id?.name,
                    start: path.node?.loc?.start,
                    end: path.node?.loc?.end,
                };
            }
        }
    });
    return functionNode;
}
// import fetch from 'node-fetch';
//# sourceMappingURL=main.js.map