type MyError = { [key in ErrorKeyEnum]: string | ((...args: any[]) => string) };
enum ErrorKeyEnum {
  InvalidParams = 100001,
  InvalidEmail = 100002,
  NotFoundUser = 100003,
  FollowYourSelf = 100004,
  BlockYourSelf = 100005,
  isBlocked = 100006
}
const errors: MyError = {
  [ErrorKeyEnum.InvalidParams]: "Invalid Params.",
  [ErrorKeyEnum.InvalidEmail]: "Invalid Email.",
  [ErrorKeyEnum.NotFoundUser]: "Not Found User.",
  [ErrorKeyEnum.FollowYourSelf]: "You cannot follow yourself.",
  [ErrorKeyEnum.BlockYourSelf]: "You cannot block yourself.",
  [ErrorKeyEnum.isBlocked]: "You cannot create a friend connection."
};

export { errors as default, ErrorKeyEnum };
