import * as R from "ramda";
import { UserModel } from "../models";

const mocks = [
  "andy@example.com",
  "john@example.com",
  "common@example.com",
  "lisa@example.com",
  "kate@example.com",
  "alieen@example.com",
  "jack@example.com"
];

export default async function initDB() {
  const records = await UserModel.findOne({});
  if (R.isNil(records)) {
    console.log("======== Data Seeding starts ========");
    await UserModel.insertMany(R.map(s => ({ email: s }), mocks));
    console.log("======== Data Seeding ends ========");
  }
}
