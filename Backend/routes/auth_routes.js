const controller = require("./../controllers/auth_controller");
const hash = require("./../utils/password-hash");
const constants = require("./../configs/app-constants");

class AuthRoutes {
  async registerRoute(req, res) {
    const data = {
      username: req?.body?.username?.toLowerCase(),
      password: req?.body?.password,
    };
    if (req?.username === "") {
      res.status(constants?.CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: constants.USERNAME_NOT_FOUND,
      });
    } else if (data?.password === "") {
      res.status(constants?.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: constants.PASSWORD_NOT_FOUND,
      });
    } else {
      try {
        data.online = "Y";
        data.socketId = "";
        data.password = hash.createHash(data.password);
        await controller
          .registerUser(data)
          .then((result) => {
            res.status(constants.SERVER_OK_HTTP_CODE).json({
              error: false,
              message: constants?.USER_REGISTRATION_OK,
            });
          })
          .catch((err) => {
            response.status(constants.SERVER_ERROR_HTTP_CODE).json({
              error: true,
              message: constants.USER_REGISTRATION_FAILED,
            });
          });
      } catch (err) {
        console.log("In error");
        res.status(constants?.SERVER_NOT_FOUND_HTTP_CODE).json({
          error: true,
          message: constants?.SERVER_ERROR_MESSAGE,
        });
      }
      return res;
    }
  }
  async userNameRoute(req, res) {
    const data = {
      username: req?.body?.username?.toLowerCase(),
    };
    if (req?.username === "") {
      res.status(constants?.CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: constants.USERNAME_NOT_FOUND,
      });
    } else {
      try {
        await controller.userNameCheck(data).then((result) => {
          if (result > 0) {
            res.status(constants?.SERVER_OK_HTTP_CODE).json({
              error: true,
              message: constants?.USERNAME_AVAILABLE_FAILED,
            });
          } else {
            res.status(constants?.SERVER_OK_HTTP_CODE).json({
              error: false,
              message: constants?.USERNAME_AVAILABLE_OK,
            });
          }
        });
      } catch (error) {
        res.status(constants?.SERVER_ERROR_HTTP_CODE).json({
          error: true,
          message: constants?.SERVER_ERROR_MESSAGE,
        });
      }
      return res;
    }
  }
  async loginUser(req, res) {
    try {
      const data = {
        username: req.body?.username.toLowerCase(),
      };
      if (req.body?.username === "") {
        res.status(constants?.SERVER_ERROR_HTTP_CODE).json({
          error: true,
          message: constants?.USERNAME_NOT_FOUND,
        });
      } else if (req.body?.password === "") {
        res.status(constants?.SERVER_ERROR_HTTP_CODE).json({
          error: true,
          message: constants?.PASSWORD_NOT_FOUND,
        });
      } else {
        const result = await controller.getUserByName(data);
        if (result === null || result === undefined) {
          res.status(constants.SERVER_ERROR_HTTP_CODE).json({
            error: true,
            message: constants?.USER_LOGIN_FAILED,
          });
        } else if (hash.compareHash(req.body?.password, result.password)) {
          await controller.makeUserOnline(data).then(() => {
            res.status(constants?.SERVER_OK_HTTP_CODE).json({
              error: false,
              message: constants.USER_LOGIN_OK,
              userId: result._id,
            });
          });
        } else {
          res.status(constants?.SERVER_ERROR_HTTP_CODE).json({
            error: true,
            message: constants?.USER_LOGIN_FAILED,
          });
        }
      }
    } catch (error) {
      res.status(constants?.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: constants?.SERVER_ERROR_MESSAGE,
      });
    }
    return res;
  }
  //   async makeUserOnline(req, res) {
  //     const data = {
  //       username: req?.body?.username,
  //     };
  //     if (
  //       data.username === "" ||
  //       data.username === null ||
  //       data.username === undefined
  //     ) {
  //       res.status(constants.SERVER_ERROR_HTTP_CODE).json({
  //         error: true,
  //         message: constants.USERNAME_NOT_FOUND,
  //       });
  //     }
  //     try {
  //       await controller.makeUserOnline(data).then((result) => {
  //         res.status(constants.SERVER_OK_HTTP_CODE).json({
  //           error: false,
  //           message: constants.USER_LOGIN_OK,
  //           output: result,
  //         });
  //       });
  //     } catch (err) {
  //       res.status(constants.SERVER_ERROR_HTTP_CODE).json({
  //         error: true,
  //         message: constants.USERNAME_NOT_FOUND,
  //       });
  //     }
  //   }
}
module.exports = new AuthRoutes();
