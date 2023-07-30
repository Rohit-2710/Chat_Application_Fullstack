const messageController = require("./../controllers/message_controller");
const sessionController = require("./../controllers/session_controller");
const constants = require("./../configs/app-constants");

class SocketRoutes {
  constructor(Server) {
    this.io = new Server();
  }
  socketEvents() {
    this.io.on("connection", (socket) => {
      socket.on("chat-list", async (data) => {
        if (data?.userId === "") {
          this.io.emit("chat-list-response", {
            error: true,
            message: constants.USER_NOT_FOUND,
          });
        } else {
          try {
            const [userInfo, chatInfo] = Promise.all([
              await sessionController.getuserData({
                id: data?.userId,
                socketId: false,
              }),
              await messageController.getChatList({ userId: data?.userId }),
            ]);
            this.io.to(socket.id).emit("chat-list-response", {
              error: false,
              singleUser: false,
              chatList: chatInfo,
            });
            socket.broadcast.emit("chat-list-response", {
              error: false,
              singleUser: true,
              chatList: userInfo,
            });
          } catch (err) {
            this.io.to(socket.id).emit("chat-list-response", {
              error: true,
              chatList: [],
            });
          }
        }
      });
    });
    socket.on("logout", async (data) => {
      try {
        const userId = data?.userId;
        await sessionController.logout(data).then((data) => {
          this.io.to(socket.id).emit("logout-response", {
            error: false,
            message: constants.USER_LOGGED_OUT,
            userId: userId,
          });
          socket.broadcast.emit("chat-list-response", {
            error: false,
            userDisconnected: true,
            userId: userId,
          });
        });
      } catch (err) {
        this.io.to(socket.id).emit({
          error: true,
          message: constants.SERVER_ERROR_MESSAGE,
          userId: userId,
        });
      }
    });
  }
  socketConfig() {
    this.io.use(async (socket, next) => {
      try {
        await controller.addSocketId({
          id: socket.request._query["userId"],
          socketId: socket?.id,
        });
        next();
      } catch (err) {
        console.log(err);
      }
    });
    this.socketEvents();
  }
}
module.exports = SocketRoutes;
