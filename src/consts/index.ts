type MyError = { [key in ErrorKeyEnum]: string | ((...args: any[]) => string) };
enum ErrorKeyEnum {
  InvalidParams = 100001,
  InvalidEmail = 100002,
  NotFoundUser = 100003,
  FollowYourSelf = 100004
}
const errors: MyError = {
  [ErrorKeyEnum.InvalidParams]: "Invalid Params.",
  [ErrorKeyEnum.InvalidEmail]: "Invalid Email.",
  [ErrorKeyEnum.FollowYourSelf]: "You cannot follow yourself.",
  [ErrorKeyEnum.NotFoundUser]: "Not Found User."
};

export { errors as default, ErrorKeyEnum };
