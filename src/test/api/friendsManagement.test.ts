import { expect } from "chai";
import supertest from "supertest";
import { default as userService } from "../../services";
import { start, dropDB, stop, server } from "../utils";
import { default as initDB, mocks } from "../../seeding";
import { ErrorKeyEnum } from "../../consts";

const prefix = "/api/v1/friends/";
const makeFriends = `${prefix}addFriends`;
describe("friends management API test", async () => {
  before(async () => {
    await start();
    await dropDB();
    await initDB();
  });

  after(async () => {
    await dropDB();
    await initDB();
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
});
