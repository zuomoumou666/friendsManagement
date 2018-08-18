import mongoose from "mongoose";
import { User, userSchema } from "../schema";

const model = mongoose.model<User>("user", userSchema);

export { model as UserModel };
