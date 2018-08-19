import mongoose from "mongoose";
import * as R from "ramda";

const Schema = mongoose.Schema;
export interface User extends mongoose.Document {
  email: string;
  friends: [string];
  subscribes: [string];
  blocks: [string];
  isBlocked(email: string): boolean;
  addFriend(email: string): boolean;
  addSubscribe(email: string): boolean;
  addBlock(email: string): boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      index: true,
      unique: true,
      required: true
    },
    friends: [String],
    subscribes: [String],
    blocks: [String]
  },
  { timestamps: true }
);

userSchema.methods.isBlocked = function(email: string) {
  return R.any(R.equals(email), this.blocks);
};

userSchema.methods.addFriend = async function(email: string) {
  if (!R.any(R.equals(email), this.friends)) {
    this.friends.push(email);
    await this.save();
    return true;
  }
  return false;
};

userSchema.methods.addSubscribe = async function(email: string) {
  if (!R.any(R.equals(email), this.subscribes)) {
    this.subscribes.push(email);
    await this.save();
    return true;
  }
  return false;
};

userSchema.methods.addBlock = async function(email: string) {
  if (!R.any(R.equals(email), this.blocks)) {
    this.blocks.push(email);
    await this.save();
    return true;
  }
  return false;
};

export { userSchema };
