import * as R from "ramda";
import validator from "validator";
import { default as UserService } from "../services";
import { MyError, ErrorKeyEnum } from "../middleware/error";
import { User } from "../schema";

export async function makeFriends({ friends }: { friends: string[] }) {
  if (R.isNil(friends) || !friends.length || friends.length !== 2) {
    throw new MyError(ErrorKeyEnum.InvalidParams);
  }

  if (R.any(email => !validator.isEmail(email), friends)) {
    throw new MyError(ErrorKeyEnum.InvalidEmail);
  }

  const users = await UserService.getTwoUsers(friends[0], friends[1]);

  if (users.length !== 2) throw new MyError(ErrorKeyEnum.NotFoundUser);

  await UserService.makeFriends(<User[]>users);
  return {};
}

export async function getFriendsList({ email }: { email: string }) {
  if (R.isNil(email) || R.isEmpty(email)) {
    throw new MyError(ErrorKeyEnum.InvalidParams);
  }
  if (!validator.isEmail(email)) throw new MyError(ErrorKeyEnum.InvalidEmail);

  const user = await UserService.getUserByEmail(email);

  if (!user) throw new MyError(ErrorKeyEnum.NotFoundUser);

  return {
    friends: user.friends,
    count: user.friends.length
  };
}
