const socket = new WebSocket(`ws://${window.location.host}`);
console.log("app.js >>>", socket);

socket.addEventListener("open", () => {
    console.log("Connection to Server.");
});

socket.addEventListener("message", (message) => {
    console.log("Just got this: ", message, " from the server.");
    //socket.
});

socket.addEventListener("close", () => {
    console.log(" Disconnect from Server.");
});