const express = require("express");
const router = require("./web/router");
const socketRoute = require("./web/socketRoutes");
const http = require("http");
const appConfig = require("./configs/app-config");
const socket = require("socket.io");

class Server {
  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.socketConn = socket.Server(this.http);
  }
  applicationConfig() {
    new appConfig(this.app).includeConfig();
  }
  routerConfig() {
    new router(this.app).routesConfig();
    new socketRoute(this.socketConn).socketConfig();
  }
  runServer() {
    this.applicationConfig();
    this.routerConfig();
    const port = process.env.PORT || 4000;
    const host = process.env.HOST || "localhost";
    this.app.listen(port, host, () => {
      console.log(`Listening on http://${host}:${port}`);
    });
  }
}

const app = new Server();
app.runServer();
