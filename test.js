const OpenAI = require("openai")
require("dotenv").config();
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env["API_KEY"],
});

async function main() {
    const messages = [
        // role: user - 질의자
        // role: assistant - 응답자
        // roel: system - 설정 요청
      { role: 'system', content: '나는 일본어를 공부중인 28살 남자야.' },
      { role: 'system', content: '너는 후쿠오카에 사는 28살 어린이집 여자 선생님이고, 너는 나와 친한 친구야.' },
      { role: 'system', content: '내가 한국인이니까, 설명에 관해서는 한글로 대답해줘.' },
      { role: 'system', content: '문어체보다는 구어체를 사용해주고, 니가 정말 사람이라고 생각하고 대답해주고, 반말로 대답해줘.' },
      { role: 'system', content: '문법이나 뉘앙스에 대해서도 함께 알려줘.' },

    ];
  
    while (true) {  // Infinite loop to handle continuous input/output
      const userQuestion = await getUserInput();  // Assume getUserInput is a function to get user input
      messages.push({ role: 'user', content: userQuestion });
  
      const stream = await openai.beta.chat.completions.stream({
        model: 'gpt-4',
        messages: messages,
        stream: true,
      });
  
      let responseContent = '';
      stream.on('content', (delta, snapshot) => {
        process.stdout.write(delta);
        responseContent += delta;  
      });
  
      await stream.finalChatCompletion();
      console.log("\n\n")
      const answer = responseContent;  // Assume the answer is in the text property
  
    //   console.log(answer);  // Output the answer
  
      // Append to text file
      const logText = `내 질문: ${userQuestion}\n응답 내용: ${answer}\n\n`;
      fs.appendFile('chat_log.txt', logText, (err) => {
        if (err) throw err;
      });
    }
  }
  
  // Assume getUserInput is a function to get user input, e.g., from the console
  async function getUserInput() {
    return new Promise((resolve, reject) => {
      process.stdin.once('data', (data) => {
        resolve(data.toString().trim());
      });
    });
  }
  
  main();