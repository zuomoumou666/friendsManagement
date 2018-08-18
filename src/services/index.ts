import * as R from "ramda";
import { UserModel } from "../models";
import { User } from "../schema";

const UserService = {
  getUserByEmail: async (email: string) => {
    return await UserModel.findOne({ email });
  },
  getTwoUsers: async (email1: string, email2: string) => {
    return await UserModel.find({ email: { $in: [email1, email2] } });
  },

  makeFriends: (users: User[]) => {
    return Promise.all(
      users.map(async user => {
        const friendEmail = (
          R.find(u => u.email !== user.email, users) || { email: "" }
        ).email;
        await user.addFriend(friendEmail);
      })
    );
  }
};

export default UserService;
