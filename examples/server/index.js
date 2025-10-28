
import { Server, api_reply } from 'iosignal'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체 (ESM에서는 직접 사용 불가)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let PORT = 7777;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  '/dist',
  // 실시간 iosigal 코드 수정 테스트시.
  express.static(path.join(__dirname, '../../', 'dist')) 
  // 설치된 패키지 사용시
  // express.static(path.join(__dirname, 'node_modules', 'iosignal', 'dist'))
);

app.use('/chat/svelte',
  express.static(path.join(__dirname, '../svelte-chat-js/build/'))
);
app.use('/chat/react',
  express.static(path.join(__dirname, '../react-chat-js/dist/'))
);
app.use('/assets',
  express.static(path.join(__dirname, '../react-chat-js/dist/assets'))
);

// 기본 라우트 (index.html 제공)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let httpServer = app.listen(PORT, () => {
  if(PORT == 0 ){
    PORT = httpServer.address().port
  }
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});





// httpServer.listen(8080);


const options = {
  httpServer: httpServer,
  // showMetric: 2,
  showMessage: 'message'
}
const ioss = new Server( options)

// api  response module
ioss.api('reply', api_reply)



