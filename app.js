const express = require("express");
const WebSocket = require("ws");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
// let onlineUsers = [];

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  console.log("A new client connected");

  ws.once("message", function handleName(name) {
    const clientName = name.toString();
    // onlineUsers.push(clientName);
    // console.log(onlineUsers);

    console.log(`${clientName} connected`);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        // client.send(onlineUsers.toString());
        client.send(`${clientName} entered the chat room`);
      }
    });

    ws.on("message", function message(data, isBinary) {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });

    ws.on("close", () => {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`${clientName} left the chat room`);
        }
      });
    });
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
