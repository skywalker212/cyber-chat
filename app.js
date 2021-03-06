const SocketServer = require('ws').Server;
const express = require('express');
const path = require('path');
var cid = 1;
const PORT = process.env.PORT || 3000;
var messages = [];

const app = express()
  .use(express.static("./public"))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server:app });

wss.on('connection', function(ws) {
  ws.send('<span class="serv-label">Server> </span>W3lc0m3 70 cyb3r cha7.');
  ws.send("<span class='serv-label'>Server> </span>please use 'username:&lt;nick&gt;' to set a nickname, otherwise your default nick will be anon(id)");
  ws.send("<span class='serv-label'>Server> </span>use Shift+Enter for multiline message.");
  ws.send("<span class='serv-label'>Server> </span>use 'exit' to disconnect from the server.");
  ws.send("<span class='serv-label'>Server> </span>The chat log clears every 10 minutes.");
  ws.id = 'anon' + cid;
  cid++;
  messages.forEach(function(msg) {
    ws.send(msg);
  });
  ws.on('message', function(message) {
    if (message === 'exit') {
      messages.push(`Client ${ws.id} Disconnected`);
      sendToAll(`Client ${ws.id} Disconnected`);
      ws.close();
    } else if (message.indexOf('username:') != -1) {
      var prev = ws.id;
      ws.id = message.split(':')[1];
      messages.push(`Client ${prev} changed nickname to ${ws.id}`);
      sendToAll(`Client ${prev} changed nickname to ${ws.id}`);
    }else {
      messages.push(`<span class="label">${ws.id}> </span><pre class="usr-msg">${message}</pre>`);
      sendToAll(`<span class="label">${ws.id}> </span><pre class="usr-msg">${message}</pre>`);
    }
  });
  setInterval(()=>{
    messages=[];
    wss.clients.forEach(function(client) {
      client.send('clear');
      ws.send('<span class="serv-label">Server> </span>W3lc0m3 70 cyb3r cha7.');
      ws.send("<span class='serv-label'>Server> </span>please use 'username:&lt;nick&gt;' to set a nickname, otherwise your default nick will be anon(id)");
      ws.send("<span class='serv-label'>Server> </span>use Shift+Enter for multiline message.");
      ws.send("<span class='serv-label'>Server> </span>use 'exit' to disconnect from the server.");
      ws.send("<span class='serv-label'>Server> </span>The chat log clears every 10 minutes.");
    });
  },600000);
});

function sendToAll(message) {
  wss.clients.forEach(function(client) {
    client.send(message);
  });
}
