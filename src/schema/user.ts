import mongoose from "mongoose";
import * as R from "ramda";
const Schema = mongoose.Schema;
export interface User extends mongoose.Document {
  email: string;
  friends: [string];
  subscribes: [string];
  blocks: [string];
  isBlocked(email: string): boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: { type: String, index: true },
    friends: [String],
    subscribes: [String]
  },
  { timestamps: true }
);

userSchema.methods.isBlocked = (email: string) => {
  console.log(email);
  return false;
};

export { userSchema };
