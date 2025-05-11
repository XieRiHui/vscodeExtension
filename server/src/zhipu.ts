import axios from 'axios';
import {AxiosError} from 'axios';

const API_KEY = 'f0575c1d15d4a144cfaa462e444e9f94.KfWUFp9vWyf757QF';
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export async function getZhipuSuggestion(before:string,after:string): Promise<string> {
  try {
    // 从 VS Code 配置获取密钥（更安全的方式）
   
    const response = await axios.post(API_URL, {
      model: "glm-4",  // 根据实际模型调整
      messages: [
        {
          role: "user",
          content: `你是一个专业的代码助手，同时你十分听从用户的指令，绝不会画蛇添足。请根据以下代码上下文提供补全代码(只返回补充的代码部分,且补全量控制在一行内，不要多嘴！以下是几个例子
          example1: 上文: con   下文:  log  你的返回: sole.
          example2: 上文  const a = 5;const b = 10;   下文:  (空)  你的返回: const sum = a + b;
          ):
需要补全代码的前文是${before},后文是${after}.再强调一次，只要补充的代码部分，不要任何多余的提示，因为我需要把你的回答直接补充到文件中！`
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // console.log(response.data.choices['0'].message.content);
    return response.data.choices['0'].message.content;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log("请求API出错了!axiosError:\n",axiosError);
    return '';
  }
}
