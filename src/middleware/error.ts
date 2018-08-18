import errors, { ErrorKeyEnum } from "../consts";
import * as R from "ramda";
import { Context } from "koa";
import * as HTTP_STATUS from "http-status";

const { RUN_ENV } = process.env;

class MyError extends Error {
  code: number;
  constructor(key: ErrorKeyEnum, ...params: any[]) {
    const msg = errors[key] as Function;
    const message = R.is(Function, msg) ? msg(...params) : msg;
    super(message);
    this.code = key;
  }
}

function finalErrorHandler() {
  return async function errorHandler(ctx: Context, next: () => Promise<any>) {
    try {
      await next();
      if (!ctx.body && (!ctx.status || ctx.status === 404)) {
        ctx.throw(404);
      }
    } catch (e) {
      ctx.type = "application/json";
      if (e.status) {
        ctx.status = e.status;
        ctx.body = {
          code: e.code || 999999,
          message: HTTP_STATUS[<keyof HttpStatus>e.status],
          // this is an internal application, and stack traces are necessary as returned messages
          stack: e.stack
        };
      } else {
        ctx.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        ctx.body = Object.assign(
          {
            code: e.code || 999999,
            message: e.message
          },
          RUN_ENV === "DEBUG" ? { stack: e.stack } : {}
        );
      }
      ctx.app.emit("error", e, ctx);
    }
  };
}

export { MyError, ErrorKeyEnum, finalErrorHandler };
