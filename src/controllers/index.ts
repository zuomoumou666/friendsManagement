import * as R from "ramda";
import { default as UserService } from "../services";
import { MyError, ErrorKeyEnum } from "../middleware/error";
import { User } from "../schema";
import { validate } from "../utils";

export async function makeFriends({ friends }: { friends: string[] }) {
  validate.towEmails(friends);

  const users = await UserService.getTwoUsers(friends[0], friends[1]);

  if (users.length !== 2) throw new MyError(ErrorKeyEnum.NotFoundUser);

  if (users[0].isBlocked(users[1].email) || users[1].isBlocked(users[0].email))
    throw new MyError(ErrorKeyEnum.isBlocked);

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
  validate.towEmails(friends);

  const users = await UserService.getTwoUsers(friends[0], friends[1]);

  if (users.length !== 2) throw new MyError(ErrorKeyEnum.NotFoundUser);

  const commonFriends = R.filter(
    email => R.any(R.equals(email), users[1].friends),
    users[0].friends
  );

  return { friends: commonFriends, count: commonFriends.length };
}

export async function addSubscribe({
  requestor,
  target
}: {
  requestor: string;
  target: string;
}) {
  if (R.isNil(requestor) || R.isNil(target))
    throw new MyError(ErrorKeyEnum.InvalidParams);

  if (requestor === target) throw new MyError(ErrorKeyEnum.FollowYourSelf);

  validate.towEmails([requestor, target]);

  const users = await UserService.getTwoUsers(requestor, target);

  if (users.length !== 2) throw new MyError(ErrorKeyEnum.NotFoundUser);

  const requestorUser = R.find(R.propEq("email", requestor), users);

  await (<User>requestorUser).addSubscribe(target);

  return {};
}

export async function addBlock({
  requestor,
  target
}: {
  requestor: string;
  target: string;
}) {
  if (R.isNil(requestor) || R.isNil(target))
    throw new MyError(ErrorKeyEnum.InvalidParams);

  if (requestor === target) throw new MyError(ErrorKeyEnum.BlockYourSelf);

  validate.towEmails([requestor, target]);

  const users = await UserService.getTwoUsers(requestor, target);

  if (users.length !== 2) throw new MyError(ErrorKeyEnum.NotFoundUser);

  const requestorUser = R.find(R.propEq("email", requestor), users);

  await (<User>requestorUser).addBlock(target);

  return {};
}
