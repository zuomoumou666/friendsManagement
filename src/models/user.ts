import mongoose from "mongoose";
import * as R from "ramda";
import { User, userSchema } from "../schema";

const model = mongoose.model<User>("user", userSchema);

export { model as UserModel };
