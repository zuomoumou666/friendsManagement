require("module-alias/register");
import koa from "koa";
import mongoose from "mongoose";
import koaBodyparser from "koa-bodyparser";
import "./config/env";
import { default as initDB } from "./seeding";

const { PORT, MONGO_DB_URL } = process.env;

process.on("unhandledRejection", (error: any) => {
  console.log("unhandledRejection", error);
});

const app = new koa();

app.use(koaBodyparser()).use(ctx => {
  console.log("ctx", ctx);
});

mongoose.connect(
  MONGO_DB_URL + "",
  { useNewUrlParser: true },
  async (err: mongoose.Error) => {
    console.log("connect success");
    // exit on connection to DB error
    if (err) {
      console.log(err);
      process.exit(1);
    }
    // initial data seeding
    await initDB();
    app.listen(PORT);
  }
);
