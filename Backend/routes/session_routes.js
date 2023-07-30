const constants = require("./../configs/app-constants");
const controller = require("../controllers/session_controller");
class SessionRoutes {
  async userSessionCheck(req, res) {
    const data = {
      id: req?.body?.id,
      online: req?.body?.online ?? "Y",
    };
    if (data.id === "" || data.id === null || data.id === undefined) {
      res.status(constants.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: constants.USERNAME_NOT_FOUND,
      });
    } else {
      try {
        await controller.userSessionCheck(data).then((result) => {
          res.status(constants.SERVER_OK_HTTP_CODE).json({
            error: false,
            data: result,
          });
        });
      } catch (err) {
        res.status(constants.SERVER_ERROR_HTTP_CODE).json({
          error: true,
          message: constants.USER_NOT_LOGGED_IN,
        });
      }
    }
  }
  async getUserData(req, res) {
    const data = {
      username: req?.body?.username,
      socketId: req?.body?.socketId,
      id: req?.body?.id,
    };
    if (data.id === undefined || data.id === null || data.id === "") {
      res.status(constants.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: constants.SERVER_ERROR_MESSAGE,
      });
    } else {
      try {
        await controller.getuserData(data).then((output) => {
          res.status(constants.SERVER_OK_HTTP_CODE).json({
            error: false,
            result: output,
          });
        });
      } catch (err) {
        res.status(constants.SERVER_ERROR_HTTP_CODE).json({
          error: true,
          message: constants.SERVER_ERROR_MESSAGE,
        });
      }
    }
  }
  async logoutUser(req, res) {
    const data = {
      socketId: req?.body?.socketId,
      id: req?.body?.id,
    };
    if (data?.id === "" || data?.id === null || data?.id === undefined) {
      res.status(constants.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: constants.USERID_NOT_FOUND,
      });
    } else {
      try {
        await controller.logout(data).then((output) => {
          res.status(constants.SERVER_OK_HTTP_CODE).json({
            error: false,
            result: output,
          });
        });
      } catch (err) {
        console.log(err);
        res.status(constants.SERVER_ERROR_HTTP_CODE).json({
          error: true,
          message: constants.SERVER_ERROR_MESSAGE,
        });
      }
    }
  }
}
module.exports = new SessionRoutes();
