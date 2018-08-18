import * as R from "ramda";
import validator from "validator";
import { default as UserService } from "../services";
import { MyError, ErrorKeyEnum } from "../middleware/error";
import { User } from "../schema";

export async function makeFriends(
  { friends }: { friends: string[] },
  ctx: any
) {
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
