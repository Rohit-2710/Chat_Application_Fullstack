class AuthHandler {
  constructor() {
    this.mongoDB = require("./../configs/db");
  }
  registerUser(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, objectId] = await this.mongoDB.connection();
        await DB.collection("users")
          .insertOne(data)
          .then(async (result) => {
            await this.mongoDB.close();
            resolve(result);
          })
          .catch(async (err) => {
            await this.mongoDB.close();
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
  userNameCheck(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, objectId] = await this.mongoDB.connection();
        await DB.collection("users")
          .countDocuments(data)
          .then(async (result) => {
            await this.mongoDB.close();
            resolve(result);
          })
          .catch(async (err) => {
            await this.mongoDB.close();
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
  getUserByName(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, objectId] = await this.mongoDB.connection();
        await DB.collection("users")
          .findOne(data)
          .then(async (result) => {
            await this.mongoDB.close();
            resolve(result);
          })
          .catch(async (err) => {
            await this.mongoDB.close();
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
  async makeUserOnline(data) {
    try {
      const [DB, objectId] = await this.mongoDB.connection();
      await DB.collection("users")
        .findOneAndUpdate(
          { username: data?.username.toLowerCase() },
          { $set: { online: "Y" } },
          { returnNewDocument: true }
        )
        .then(async (result) => {
          await this.mongoDB.close();
          return result;
        })
        .catch(async (err) => {
          await this.mongoDB.close();
          return err;
        });
    } catch (err) {
      return err;
    }
  }
}
module.exports = new AuthHandler();
