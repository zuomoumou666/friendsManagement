import * as R from "ramda";
import { default as UserService } from "../services";
import { MyError, ErrorKeyEnum } from "../middleware/error";
import { User } from "../schema";
import { validate } from "../utils";

export async function makeFriends({ friends }: { friends: string[] }) {
  validate.friends(friends);

  const users = await UserService.getTwoUsers(friends[0], friends[1]);

  if (users.length !== 2) throw new MyError(ErrorKeyEnum.NotFoundUser);

  await UserService.makeFriends(<User[]>users);
  return {};
}

export async function getFriendsList({ email }: { email: string }) {
  validate.email(email);

  const user = await UserService.getUserByEmail(email);

  if (!user) throw new MyError(ErrorKeyEnum.NotFoundUser);

  return {
    friends: user.friends,
    count: user.friends.length
  };
}

export async function getCommonFriends({ friends }: { friends: string[] }) {
  validate.friends(friends);

  const users = await UserService.getTwoUsers(friends[0], friends[1]);

  if (users.length !== 2) throw new MyError(ErrorKeyEnum.NotFoundUser);

  const commonFriends = R.filter(
    email => R.any(R.equals(email), users[1].friends),
    users[0].friends
  );

  return { friends: commonFriends, count: commonFriends.length };
}
