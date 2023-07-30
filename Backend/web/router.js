const authRoutes = require("./../routes/auth_routes");
const sessionRoutes = require("./../routes/session_routes");
class Routes {
  constructor(app) {
    this.app = app;
  }
  allRoutes() {
    this.app.post("/register", authRoutes.registerRoute);
    this.app.post("/login", authRoutes.loginUser);
    this.app.post("/userNameAvailable", authRoutes.userNameRoute);
    this.app.post("/userSession", sessionRoutes.userSessionCheck);
  }
  routesConfig() {
    this.allRoutes();
  }
}
module.exports = Routes;
