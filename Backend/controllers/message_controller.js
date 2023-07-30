class MessageController {
  constructor() {
    this.mongo = require("../configs/db");
  }
  async getMessage(data) {
    const [DB, objectId] = await this.mongo.connection();
    let filter = {
      $or: [
        {
          $and: [{ toUserId: data?.userId }, { fromUserId: data?.toUserId }],
        },
        {
          $and: [{ toUserId: data?.toUserId }, { fromUserId: data?.userId }],
        },
      ],
    };
    let limit = {
      $limit: 10,
    };
    let sort = {
      timestamp: 1,
    };
    return await DB.collection("messages")
      .aggregate({ $match: filter }, { $sort: sort }, limit)
      .toArray(async (data) => {
        await this.mongo.close();
        return data;
      })
      .catch(async (err) => {
        await this.mongo.close();
        return err;
      });
  }
  async insertMessage(data) {
    const [DB, objectId] = await this.mongo.connection();
    return await DB.collection("messages")
      .insertOne(data)
      .then(async (result) => {
        await this.mongo.close();
        return data;
      })
      .catch(async (err) => {
        await this.mongo.close();
        return err;
      });
  }
  async addSocketId(data) {
    const [DB, objectId] = await this.mongo.connection();
    const filter = {
      _id: new objectId(data?.id),
    };
    const update = {
      $set: { socketId: data?.socketId },
    };
    await DB.collection("users")
      .updateOne(filter, update)
      .then(async (data) => {
        await this.mongo.close();
        return data;
      })
      .catch(async (err) => {
        await this.mongo.close();
        return err;
      });
  }
  async getChatList(data) {
    const [DB, objectId] = await this.mongo.connection();
    let filter = {
      socketId: { $ne: data?.userId },
    };
    let projection = {
      id: "$_id",
      username: true,
      _id: false,
      socketId: true,
      online: true,
    };
    return DB.connection("users")
      .aggregate({ $match: filter }, { $project: projection })
      .toArray()
      .then(async (data) => {
        await this.mongo.close();
        return data;
      })
      .catch(async (err) => {
        await this.mongo.close();
        return err;
      });
  }
}
module.exports = new MessageController();
