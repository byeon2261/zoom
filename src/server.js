// express로 할일은 view를 설정해주고 render해주는 것이 전부다. (Zoom프로젝트에서는 두기능만 쓴다는 거다.)
import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
// __dirname 예러가 발생하여 추가함.
import path from 'path';
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
app.get("/*", (req,res) => res.redirect("/"));
//하단과 무슨 차이?
// app.get("/", (_, res) => res.render("home"));
// app.get("/*", (_,res) => res.redirect("/"));


const handleListen = () => console.log('Listening on http://localhost:3000');
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