const WebSocketServer = require('ws').Server;
const express = require('express');
const http = require('http');
var cid = 1;
var messages = [];

const app = new express();
const server = http.createServer(app);

var wss = new WebSocketServer({
  port: 3000
});

app.use(express.static("./public"));

wss.on('connection', function(ws) {
  ws.send('<span class="serv-label">Server> </span>W3lc0m3 70 cyb3r cha7.');
  ws.send("<span class='serv-label'>Server> </span>please use 'username:&lt;nick&gt;' to set a nickname, otherwise you defalut nick will be anon(id)");
  ws.send("<span class='serv-label'>Server> </span>use 'exit' to dicsonnect from the server.");
  ws.id = 'anon' + cid;
  cid++;
  messages.forEach(function(msg) {
    ws.send(msg);
  });
  ws.on('message', function(message) {
    if (message === 'exit') {
      messages.push(`Client ${ws.id} Disonnected`);
      sendToAll(`Client ${ws.id} Disonnected`);
      ws.close();
    } else if (message.indexOf('username:') != -1) {
      var prev = ws.id;
      ws.id = message.split(':')[1];
      messages.push(`Client ${prev} changed nickname to ${ws.id}`);
      sendToAll(`Client ${prev} changed nickname to ${ws.id}`);
    } else {
      messages.push(`<span class="label">${ws.id}> </span>${message}`);
      sendToAll(`<span class="label">${ws.id}> </span>${message}`);
    }
  });
});

app.listen(420);

function sendToAll(message) {
  wss.clients.forEach(function(client) {
    client.send(message);
  });
}
