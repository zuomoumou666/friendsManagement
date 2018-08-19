import { expect } from "chai";
import supertest from "supertest";
import { default as userService } from "../../services";
import { start, dropDB, stop, server } from "../utils";
import { default as initDB, mocks } from "../../seeding";
import { ErrorKeyEnum } from "../../consts";

const prefix = "/api/v1/friends/";
const makeFriends = `${prefix}addFriends`;
const getFriendsList = `${prefix}getFriendsList`;
const getCommonFriends = `${prefix}getCommonFriends`;
const addSubscribe = `${prefix}addSubscribe`;
const addBlock = `${prefix}addBlock`;

describe("friends management API test", async () => {
  before(async () => {
    console.log("before");
    await start();
    await dropDB();
    await initDB();
  });

  after(async () => {
    console.log("end");
    // await dropDB();
    // await initDB();
    await stop();
  });

  describe(makeFriends, async () => {
    it("should be throw Error if friends = []", async () => {
      const response = await supertest(server)
        .post(makeFriends)
        .send({
          friends: []
        });

      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if friends.length === 1", async () => {
      const response = await supertest(server)
        .post(makeFriends)
        .send({
          friends: [mocks[0]]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if input a wrong email", async () => {
      const response = await supertest(server)
        .post(makeFriends)
        .send({
          friends: ["adf", "ccc"]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidEmail);
    });

    it("should be success", async () => {
      const response = await supertest(server)
        .post(makeFriends)
        .send({
          friends: [mocks[0], mocks[1]]
        });

      const user1 = await userService.getUserByEmail(mocks[0]);
      const user2 = await userService.getUserByEmail(mocks[1]);

      expect(response.body.code).to.be.eqls(1);
      expect((<any>user1).friends).to.be.eqls([mocks[1]]);
      expect((<any>user2).friends).to.be.eqls([mocks[0]]);
    });
  });

  describe(getFriendsList, async () => {
    it("should be throw Error if email isNil", async () => {
      const response = await supertest(server)
        .post(getFriendsList)
        .send({});
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });
    it("should be throw Error if email is wrong", async () => {
      const response = await supertest(server)
        .post(getFriendsList)
        .send({
          email: "123"
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidEmail);
    });

    it("should be success", async () => {
      await dropDB();
      await initDB();

      await supertest(server)
        .post(makeFriends)
        .send({
          friends: [mocks[0], mocks[1]]
        });

      await supertest(server)
        .post(makeFriends)
        .send({
          friends: [mocks[0], mocks[2]]
        });

      const response = await supertest(server)
        .post(getFriendsList)
        .send({
          email: mocks[0]
        });

      expect(response.body).to.be.eqls({
        success: true,
        code: 1,
        friends: [mocks[1], mocks[2]],
        count: 2
      });
    });
  });

  describe(getCommonFriends, async () => {
    it("should be throw Error if friends = []", async () => {
      const response = await supertest(server)
        .post(getCommonFriends)
        .send({
          friends: []
        });

      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if friends.length === 1", async () => {
      const response = await supertest(server)
        .post(getCommonFriends)
        .send({
          friends: [mocks[0]]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if input a wrong email", async () => {
      const response = await supertest(server)
        .post(getCommonFriends)
        .send({
          friends: ["adf", "ccc"]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidEmail);
    });

    it("should be success", async () => {
      await dropDB();
      await initDB();
      await supertest(server)
        .post(makeFriends)
        .send({
          friends: [mocks[0], mocks[1]]
        });

      await supertest(server)
        .post(makeFriends)
        .send({
          friends: [mocks[0], mocks[2]]
        });

      const response = await supertest(server)
        .post(getCommonFriends)
        .send({
          friends: [mocks[1], mocks[2]]
        });

      expect(response.body).to.be.eqls({
        success: true,
        code: 1,
        friends: [mocks[0]],
        count: 1
      });
    });
  });
  describe(addSubscribe, async () => {
    it("should be throw Error if not send params", async () => {
      const response = await supertest(server)
        .post(addSubscribe)
        .send({});

      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if lost target", async () => {
      const response = await supertest(server)
        .post(addSubscribe)
        .send({
          requestor: mocks[0]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if lost requestor", async () => {
      const response = await supertest(server)
        .post(addSubscribe)
        .send({
          target: mocks[0]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if input a wrong email", async () => {
      const response = await supertest(server)
        .post(addSubscribe)
        .send({
          requestor: "123",
          target: "234"
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidEmail);
    });

    it("should be throw Error if cannot found users", async () => {
      const response = await supertest(server)
        .post(addSubscribe)
        .send({
          requestor: "123@123.com",
          target: "234@123.com"
        });
      expect(response.body).with.property("code", ErrorKeyEnum.NotFoundUser);
    });

    it("should be throw Error if requestor === target", async () => {
      const response = await supertest(server)
        .post(addSubscribe)
        .send({
          requestor: mocks[0],
          target: mocks[0]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.FollowYourSelf);
    });

    it("should be success", async () => {
      await dropDB();
      await initDB();

      const response = await supertest(server)
        .post(addSubscribe)
        .send({
          requestor: mocks[0],
          target: mocks[1]
        });

      const user = await userService.getUserByEmail(mocks[0]);

      expect(response.body.code).to.be.eqls(1);
      expect((<any>user).subscribes).to.be.eqls([mocks[1]]);
    });
  });
  describe(addBlock, async () => {
    it("should be throw Error if not send params", async () => {
      const response = await supertest(server)
        .post(addBlock)
        .send({});

      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if lost target", async () => {
      const response = await supertest(server)
        .post(addBlock)
        .send({
          requestor: mocks[0]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if lost requestor", async () => {
      const response = await supertest(server)
        .post(addBlock)
        .send({
          target: mocks[0]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidParams);
    });

    it("should be throw Error if input a wrong email", async () => {
      const response = await supertest(server)
        .post(addBlock)
        .send({
          requestor: "123",
          target: "234"
        });
      expect(response.body).with.property("code", ErrorKeyEnum.InvalidEmail);
    });

    it("should be throw Error if cannot found users", async () => {
      const response = await supertest(server)
        .post(addBlock)
        .send({
          requestor: "123@123.com",
          target: "234@123.com"
        });
      expect(response.body).with.property("code", ErrorKeyEnum.NotFoundUser);
    });

    it("should be throw Error if requestor === target", async () => {
      const response = await supertest(server)
        .post(addBlock)
        .send({
          requestor: mocks[0],
          target: mocks[0]
        });
      expect(response.body).with.property("code", ErrorKeyEnum.BlockYourSelf);
    });

    it("should be success", async () => {
      await dropDB();
      await initDB();

      const response = await supertest(server)
        .post(addBlock)
        .send({
          requestor: mocks[0],
          target: mocks[1]
        });

      const user = await userService.getUserByEmail(mocks[0]);

      expect(response.body.code).to.be.eqls(1);
      expect((<any>user).blocks).to.be.eqls([mocks[1]]);
    });
  });
});
