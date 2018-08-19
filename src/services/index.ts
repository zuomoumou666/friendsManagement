import * as R from "ramda";
import { UserModel } from "../models";
import { User } from "../schema";

const userService = {
  getUserByEmail: async (email: string) => {
    return await UserModel.findOne({ email });
  },
  getTwoUsers: async (email1: string, email2: string) => {
    return await UserModel.find({ email: { $in: [email1, email2] } });
  },

  makeFriends: async (users: User[]) => {
    return Promise.all(
      users.map(async user => {
        const friendEmail = (
          R.find(u => u.email !== user.email, users) || { email: "" }
        ).email;
        await user.addFriend(friendEmail);
      })
    );
  },
  retrieveSubscribeList: async (email: string, mentions?: string[] | null) => {
    const query = {
      $and: [
        {
          $or: [{ friends: email }, { subscribes: email }]
        },
        {
          blocks: {
            $not: {
              $in: [email]
            }
          }
        }
      ]
    };

    if (!R.isNil(mentions)) {
      (<any>query.$and[0].$or).push({ email: { $in: mentions } });
    }

    const users = await UserModel.find(query);

    return R.map(u => u.email, users);
  }
};

export default userService;
