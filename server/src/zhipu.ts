import axios from 'axios';
import {AxiosError} from 'axios';

const API_KEY = 'f0575c1d15d4a144cfaa462e444e9f94.KfWUFp9vWyf757QF';
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export async function getZhipuSuggestion(before:string,after:string): Promise<string> {
  try {
   
    const response = await axios.post(API_URL, {
      model: "glm-4",  // 根据实际模型调整
      messages: [
        {
          role: "user",
          content: `#角色
你是一个专业的代码手
#任务
你需要根据所给的javaScript代码的上文(before)和下文(after)，自动补全中间的代码.要求返回的格式为 :  &&&{补全的内容}&&&
#before
${before}
#after
${after}`
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data.choices['0'].message.content;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log("请求API出错了!axiosError:\n",axiosError);
    return '';
  }
}
