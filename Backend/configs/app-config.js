const expressConfig = require("./express-config");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

class AppConfig {
  app;
  constructor(app) {
    dotenv.config();
    this.app = app;
  }
  includeConfig() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    new expressConfig(this.app);
  }
}
module.exports = AppConfig;
