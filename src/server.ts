import koa from "koa";
import mongoose from "mongoose";
import koaBodyparser from "koa-bodyparser";
import "./config/env";
import { router } from "./routes";
import { finalErrorHandler } from "./middleware/error";
import cors from "./middleware/cors";
import { default as initDB } from "./seeding";

const { PORT, MONGO_DB_URL, RUN_ENV } = process.env;

process.on("unhandledRejection", (error: any) => {
  console.log("unhandledRejection", error);
});

const app = new koa();

mongoose.connect(
  `${MONGO_DB_URL}`,
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
    RUN_ENV === "DEBUG" && app.use(cors({}));

    app
      .use(finalErrorHandler())
      .use(koaBodyparser())
      .use(router.routes());
    app.listen(PORT);
  }
);
