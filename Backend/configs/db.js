const mongoDb = require("mongodb");
const assert = require("assert");
const dotenv = require("dotenv");

class Db {
  constructor() {
    dotenv.config();
    this.url = process.env.DB_URL;
    this.mongoClient = new mongoDb.MongoClient(this.url);
    this.objectID = mongoDb.ObjectId;
  }

  connection() {
    return new Promise((resolve, reject) => {
      this.mongoClient
        .connect()
        .then(() => {
          const db = this.mongoClient.db(process.env.DATABASE);
          resolve([db, this.objectID]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  async close() {
    await this.mongoClient.close();
  }
}
module.exports = new Db();
