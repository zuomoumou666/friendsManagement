import koa from "koa";
import mongoose from "mongoose";
import koaBodyparser from "koa-bodyparser";
import { createServer } from "http";
import "../config/env";
import { router } from "../routes";
import { finalErrorHandler } from "../middleware/error";
import { UserModel } from "../models";

const { MONGO_TEST_DB_URL } = process.env;

const app = new koa();
app
  .use(finalErrorHandler())
  .use(koaBodyparser())
  .use(router.routes());

let server: any = null;

export async function start() {
  process.on("unhandledRejection", (error: any) => {
    console.log("unhandledRejection", error);
  });

  server = await createServer(app.callback()).listen(4000);

  await mongoose.connect(
    `${MONGO_TEST_DB_URL}`,
    { useNewUrlParser: true },
    async (err: mongoose.Error) => {
      console.log("connect success");
      // exit on connection to DB error
      if (err) {
        console.log(err);
        process.exit(1);
      }
    }
  );
}

export async function stop() {
  server.close();
}

export async function dropDB() {
  await UserModel.deleteMany({});
}

export { app, server };
