"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZhipuSuggestion = getZhipuSuggestion;
const axios_1 = __importDefault(require("axios"));
const vscode = __importStar(require("vscode"));
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
async function getZhipuSuggestion(before, after) {
    try {
        // 从 VS Code 配置获取密钥（更安全的方式）
        const config = vscode.workspace.getConfiguration('zhipuAI');
        const apiKey = config.get('apiKey');
        if (!apiKey) {
            vscode.window.showErrorMessage('请先配置智谱AI的API Key');
            return '';
        }
        const response = await axios_1.default.post(API_URL, {
            model: "glm-4", // 根据实际模型调整
            messages: [
                {
                    role: "user",
                    content: `你是一个专业的代码助手，请为以下代码提供补全代码（只返回补全代码部分不要多余的解释也不要包含任何原来的代码）,且补全量控制在一行内：
需要补全代码的前文是${before},后文是${after}`
                }
            ],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data.choices['0'].message.content);
        return response.data.choices['0'].message.content;
    }
    catch (error) {
        const axiosError = error;
        vscode.window.showErrorMessage(`API 请求失败: ${axiosError.response?.data || axiosError.message}`);
        return '';
    }
}
//# sourceMappingURL=zhipu.js.map