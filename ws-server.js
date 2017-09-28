const WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port:3000});

wss.on('connection',function (ws,req) {
  ws.send('<span class="label">Server> </span>W3lc0m3 70 cyb3r cha7.');
  ws.on('message',function (message) {
    if (message==='exit') {
      wss.clients.forEach(function (client) {
        client.send('<span class="label">Server> </span> ${}');
      });
      ws.close();
    }else {
      wss.clients.forEach(function (client) {
        client.send(message);
      });
    }
  });
});
