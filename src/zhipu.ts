import axios from 'axios';
import {AxiosError} from 'axios';
import * as vscode from 'vscode';

const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export async function getZhipuSuggestion(before:string,after:string): Promise<string> {
  try {
    // 从 VS Code 配置获取密钥（更安全的方式）
    const config = vscode.workspace.getConfiguration('zhipuAI');
    const apiKey = config.get('apiKey') as string;

    if (!apiKey) {
      vscode.window.showErrorMessage('请先配置智谱AI的API Key');
      return '';
    }

    const response = await axios.post(API_URL, {
      model: "glm-4",  // 根据实际模型调整
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
  } catch (error) {
    const axiosError = error as AxiosError;
    vscode.window.showErrorMessage(`API 请求失败: ${axiosError.response?.data || axiosError.message}`);
    return '';
  }
}
