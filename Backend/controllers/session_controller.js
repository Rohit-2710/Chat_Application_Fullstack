const mongo = require("../configs/db");

class SessionRoutes {
  constructor() {
    this.mongo = mongo;
  }
  async userSessionCheck(data) {
    try {
      const [DB, objectID] = await this.mongo.connection();
      return await DB.collection("users")
        .findOne({
          _id: new objectID(data?.id),
          online: data?.online,
        })
        .then(async (result) => {
          await this.mongo.close();
          return result;
        })
        .catch(async (err) => {
          await this.mongo.close();
          return err;
        });
    } catch (err) {
      return err;
    }
  }
  async getuserData(data) {
    let projection;
    if (data?.sockedtId) {
      projection = {
        socketId: true,
      };
    } else {
      projection = {
        username: true,
        _id: false,
        id: "$_id",
        password: true,
        online: true,
      };
    }
    const [DB, objectID] = await this.mongo.connection();
    return await DB.collection("users")
      .aggregate([
        { $match: { _id: new objectID(data?.id) } },
        { $project: projection },
      ])
      .toArray()
      .then(async (data) => {
        await this.mongo.close();
        return data[0];
      })
      .catch(async (err) => {
        await this.mongo.close();
        return err;
      });
  }
  async logout(data) {
    const [DB, objectId] = await this.mongo.connection();
    let filter = {};
    if (data?.sockedtId) {
      filter.socketId = data?.socketId;
    } else {
      filter._id = new objectId(data.id);
    }
    let update = {
      $set: { online: "N" },
    };
    return await DB.collection("users")
      .updateOne(filter, update)
      .then(async (result) => {
        await this.mongo.close();
        return result;
      })
      .catch(async (err) => {
        await this.mongo.close();
        return err;
      });
  }
}
module.exports = new SessionRoutes();
