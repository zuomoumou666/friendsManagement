require("module-alias/register");
import koa from "koa";
import mongoose from "mongoose";
import koaBodyparser from "koa-bodyparser";
import "./config/env";
const { PORT } = process.env;

process.on("unhandledRejection", (error: any) => {
  console.log("unhandledRejection", error);
});

const app = new koa();

app.use(koaBodyparser()).use(ctx => {
  console.log("ctx.", ctx);
});

console.log(PORT);
app.listen(PORT);
