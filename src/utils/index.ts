import * as R from "ramda";
import validator from "validator";
import { MyError, ErrorKeyEnum } from "../middleware/error";

const validate = {
  towEmails: (friends: string[]) => {
    if (R.isNil(friends) || !friends.length || friends.length !== 2) {
      throw new MyError(ErrorKeyEnum.InvalidParams);
    }

    if (
      R.any(email => !R.is(String, email) || !validator.isEmail(email), friends)
    ) {
      throw new MyError(ErrorKeyEnum.InvalidEmail);
    }
  },
  email: (email: string) => {
    if (R.isNil(email) || R.isEmpty(email) || !R.is(String, email)) {
      throw new MyError(ErrorKeyEnum.InvalidParams);
    }
    if (!validator.isEmail(email)) throw new MyError(ErrorKeyEnum.InvalidEmail);
  }
};
export { validate };
