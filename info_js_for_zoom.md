@src/server.js 예전에 강의를 들으면서 작성한 로직과 주석을 옮겨 놓겠다.

```js
// express로 할일은 view를 설정해주고 render해주는 것이 전부다. (Zoom프로젝트에서는 두기능만 쓴다는 거다.)
import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
// __dirname 예러가 발생하여 추가함.
import path from "path";
import { Socket } from "dgram";
const __dirname = path.resolve();

const app = express();
console.log("Hello");

// pug 페이지를 렌더링하기 위한 설정
app.set("view engine", "pug");
// 교육영상 니꼬컴에서는 /src를 추가로 넣어줬다. (?)
//app.set("views", __dirname + "/views");
app.set("views", __dirname + "/src/views");
//app.use("/public", express.static(__dirname + "/public/js"));
/* 하단 주소설정때문에 2시간동안 오류를 해결하지 못했다 
    home.pug 에 script(src="/public/js/app.js") 부분에서 "Unexpected token '<' "에러가 발생 */
app.use("/public", express.static(__dirname + "/src/public"));
// 사용할 유일한 루트
// 홈으로 가면 request,response를 받고 res.render를 한다. home을 렌더한다.
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
//하단과 무슨 차이?
// app.get("/", (_, res) => res.render("home"));
// app.get("/*", (_,res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");
// const handleListen = () => console.log('Listening on ws://localhost:3000'); 해당 방식은 ws서버만 생성이 된다.(?)
// app.listen(3000);

// 서버는 생성돠었다. websocket을 설정할 준비는 돠었다.
const server = http.createServer(app);

// Server을 넣지 않아도 된다. 같아보이지만 webSocket.Server를 사용하면 app이 깨진다. why?
//const wss = new WebSocket.Server({ server });
const wss = new WebSocketServer({ server });
// 상단으로 설정을 하면 websocket서버와 http서버 둘 다 사용이 가능하다.

// 아래형식은 vanilla JS를 할때 사용하는 방식이다. socket에 연결하여 함수를 실행하는 방식이 js랑 유사하다.
// function handleConnection(socket) {
//     console.log(socket);
// }
// wss.on("connection", handleConnection);
wss.on("connection", (socket) => {
  console.log("Connect to Browser.");
  socket.send("Hello!!");
});
// 연결하였으니 프론트에서 표기해야한다.

server.listen(3000, handleListen);
```

### 1.2 WebSockets in NodeJS

Node.js의 websocet을 설치하여 사용한다.

<https://www.npmjs.com/package/ws>

    $ npm i ws

http프로토콜 대신에 ws를 사용한다.

@src/server.js

```js
import http from "http";
import WebSocket from "ws";

const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Server()에 server을 넣어줘도 된다. 필수값이 아님
```

WebSocket.Server()안에 'server'를 넣어주면 http,ws 둘 다 사용이 가능하다.
http서버 위에 webSocket서버를 만들었다.
이번 프로젝트에서는 http프로토콜도 사용하기위해서 둘다 생성했지만 ws서버만을 생성하여 사용이 가능하다.

### 1.3 WebSocket Events

WebSocket Server를 사용하도록 하겠다.

@src/server.js

```js
function handleConnection(socket) {
  console.log(socket);
}

// www.on(통신에 대한 설정을 넣어준다, 받는 socket을 컨트롤한다.)
wss.on("connection", handleConnection);
```

frontend에서 backend로 연결이 이뤄지도록 적용을 한다.

@src/public/js/app.js

```js
const socket = new WebSocket(`http://localhost:3000`);
```

브라우져로 실행을 하면 console에서 에러가 발생한다.

```sh
caught DOMException: Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. 'http' is not allowed.
```

websocket에 http대신에 ws를 사용해줘야 통신이 가능하다.
http를 ws로 변경해준다.
로컬이 아닌 다른 접속경로로 접근할 경우 url이 변경된다. localhost대신에 우리가 어디에 있는지 정보를 주자.

```js
const socket = new WebSocket(`ws://${window.location.host}`);
```

<https://developer.mozilla.org/ko/docs/Web/API/Window/location>

설정 후 브라우져에 접속을 다시 하면 vscode console에 socket정보가 출력된다.

여기있는 socket이 frontend와 real-time으로 소통할 수 있다.

```sh
<ref *1> WebSocket {
  _events: [Object: null prototype] { close: [Function (anonymous)] },
  _eventsCount: 1,
  _maxListeners: undefined,
  _binaryType: 'nodebuffer',
  _closeCode: 1006,
  _closeFrameReceived: false,
  _closeFrameSent: false,
  _closeMessage: <Buffer >,
  _closeTimer: null,
  _extensions: {},
  _paused: false,
  _protocol: '',
  _readyState: 1,
  _receiver: Receiver {
    _writableState: WritableState {
      objectMode: false,
      highWaterMark: 16384,
      finalCalled: false,
      needDrain: false,
      ending: false,
      ended: false,
      finished: false,
      destroyed: false,
      decodeStrings: true,
      defaultEncoding: 'utf8',
      length: 0,
      writing: false,
      corked: 0,
      sync: true,
      bufferProcessing: false,
      onwrite: [Function: bound onwrite],
      writecb: null,
      writelen: 0,
      afterWriteTickInfo: null,
      buffered: [],
      bufferedIndex: 0,
      allBuffers: true,
      allNoop: true,
      pendingcb: 0,
      constructed: true,
      prefinished: false,
      errorEmitted: false,
      emitClose: true,
      autoDestroy: true,
      errored: null,
      closed: false,
      closeEmitted: false,
      [Symbol(kOnFinished)]: []
    },
    _events: [Object: null prototype] {
      conclude: [Function: receiverOnConclude],
      drain: [Function: receiverOnDrain],
      error: [Function: receiverOnError],
      message: [Function: receiverOnMessage],
      ping: [Function: receiverOnPing],
      pong: [Function: receiverOnPong]
    },
    _eventsCount: 6,
    _maxListeners: undefined,
    _binaryType: 'nodebuffer',
    _extensions: {},
    _isServer: true,
    _maxPayload: 104857600,
    _skipUTF8Validation: false,
    _bufferedBytes: 0,
    _buffers: [],
    _compressed: false,
    _payloadLength: 0,
    _mask: undefined,
    _fragmented: 0,
    _masked: false,
    _fin: false,
    _opcode: 0,
    _totalPayloadLength: 0,
    _messageLength: 0,
    _fragments: [],
    _state: 0,
    _loop: false,
    [Symbol(kCapture)]: false,
    [Symbol(websocket)]: [Circular *1]
  },
  _sender: Sender {
    _extensions: {},
    _socket: Socket {
      connecting: false,
      _hadError: false,
      _parent: null,
      _host: null,
      _readableState: [ReadableState],
      _events: [Object: null prototype],
      _eventsCount: 4,
      _maxListeners: undefined,
      _writableState: [WritableState],
      allowHalfOpen: true,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: '',
      server: [Server],
      _server: [Server],
      parser: null,
      on: [Function (anonymous)],
      addListener: [Function (anonymous)],
      prependListener: [Function: prependListener],
      setEncoding: [Function: socketSetEncoding],
      _paused: false,
      timeout: 0,
      [Symbol(async_id_symbol)]: 48,
      [Symbol(kHandle)]: [TCP],
      [Symbol(kSetNoDelay)]: true,
      [Symbol(lastWriteQueueSize)]: 0,
      [Symbol(timeout)]: null,
      [Symbol(kBuffer)]: null,
      [Symbol(kBufferCb)]: null,
      [Symbol(kBufferGen)]: null,
      [Symbol(kCapture)]: false,
      [Symbol(kBytesRead)]: 0,
      [Symbol(kBytesWritten)]: 0,
      [Symbol(RequestTimeout)]: undefined,
      [Symbol(websocket)]: [Circular *1]
    },
    _firstFragment: true,
    _compress: false,
    _bufferedBytes: 0,
    _deflating: false,
    _queue: []
  },
  _socket: <ref *2> Socket {
    connecting: false,
    _hadError: false,
    _parent: null,
    _host: null,
    _readableState: ReadableState {
      objectMode: false,
      highWaterMark: 16384,
      buffer: BufferList { head: null, tail: null, length: 0 },
      length: 0,
      pipes: [],
      flowing: true,
      ended: false,
      endEmitted: false,
      reading: true,
      constructed: true,
      sync: false,
      needReadable: true,
      emittedReadable: false,
      readableListening: false,
      resumeScheduled: true,
      errorEmitted: false,
      emitClose: false,
      autoDestroy: true,
      destroyed: false,
      errored: null,
      closed: false,
      closeEmitted: false,
      defaultEncoding: 'utf8',
      awaitDrainWriters: null,
      multiAwaitDrain: false,
      readingMore: false,
      dataEmitted: false,
      decoder: null,
      encoding: null,
      [Symbol(kPaused)]: false
    },
    _events: [Object: null prototype] {
      end: [Array],
      close: [Function: socketOnClose],
      data: [Function: socketOnData],
      error: [Function: socketOnError]
    },
    _eventsCount: 4,
    _maxListeners: undefined,
    _writableState: WritableState {
      objectMode: false,
      highWaterMark: 16384,
      finalCalled: false,
      needDrain: false,
      ending: false,
      ended: false,
      finished: false,
      destroyed: false,
      decodeStrings: false,
      defaultEncoding: 'utf8',
      length: 0,
      writing: false,
      corked: 0,
      sync: false,
      bufferProcessing: false,
      onwrite: [Function: bound onwrite],
      writecb: null,
      writelen: 0,
      afterWriteTickInfo: [Object],
      buffered: [],
      bufferedIndex: 0,
      allBuffers: true,
      allNoop: true,
      pendingcb: 1,
      constructed: true,
      prefinished: false,
      errorEmitted: false,
      emitClose: false,
      autoDestroy: true,
      errored: null,
      closed: false,
      closeEmitted: false,
      [Symbol(kOnFinished)]: []
    },
    allowHalfOpen: true,
    _sockname: null,
    _pendingData: null,
    _pendingEncoding: '',
    server: Server {
      maxHeaderSize: undefined,
      insecureHTTPParser: undefined,
      _events: [Object: null prototype],
      _eventsCount: 5,
      _maxListeners: undefined,
      _connections: 2,
      _handle: [TCP],
      _usingWorkers: false,
      _workers: [],
      _unref: false,
      allowHalfOpen: true,
      pauseOnConnect: false,
      httpAllowHalfOpen: false,
      timeout: 0,
      keepAliveTimeout: 5000,
      maxHeadersCount: null,
      maxRequestsPerSocket: 0,
      headersTimeout: 60000,
      requestTimeout: 0,
      _connectionKey: '6::::3000',
      [Symbol(IncomingMessage)]: [Function: IncomingMessage],
      [Symbol(ServerResponse)]: [Function: ServerResponse],
      [Symbol(kCapture)]: false,
      [Symbol(async_id_symbol)]: 19
    },
    _server: Server {
      maxHeaderSize: undefined,
      insecureHTTPParser: undefined,
      _events: [Object: null prototype],
      _eventsCount: 5,
      _maxListeners: undefined,
      _connections: 2,
      _handle: [TCP],
      _usingWorkers: false,
      _workers: [],
      _unref: false,
      allowHalfOpen: true,
      pauseOnConnect: false,
      httpAllowHalfOpen: false,
      timeout: 0,
      keepAliveTimeout: 5000,
      maxHeadersCount: null,
      maxRequestsPerSocket: 0,
      headersTimeout: 60000,
      requestTimeout: 0,
      _connectionKey: '6::::3000',
      [Symbol(IncomingMessage)]: [Function: IncomingMessage],
      [Symbol(ServerResponse)]: [Function: ServerResponse],
      [Symbol(kCapture)]: false,
      [Symbol(async_id_symbol)]: 19
    },
    parser: null,
    on: [Function (anonymous)],
    addListener: [Function (anonymous)],
    prependListener: [Function: prependListener],
    setEncoding: [Function: socketSetEncoding],
    _paused: false,
    timeout: 0,
    [Symbol(async_id_symbol)]: 48,
    [Symbol(kHandle)]: TCP {
      reading: true,
      onconnection: null,
      _consumed: true,
      [Symbol(owner_symbol)]: [Circular *2]
    },
    [Symbol(kSetNoDelay)]: true,
    [Symbol(lastWriteQueueSize)]: 0,
    [Symbol(timeout)]: null,
    [Symbol(kBuffer)]: null,
    [Symbol(kBufferCb)]: null,
    [Symbol(kBufferGen)]: null,
    [Symbol(kCapture)]: false,
    [Symbol(kBytesRead)]: 0,
    [Symbol(kBytesWritten)]: 0,
    [Symbol(RequestTimeout)]: undefined,
    [Symbol(websocket)]: [Circular *1]
  },
  _isServer: true,
  [Symbol(kCapture)]: false
}
```
