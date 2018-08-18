import koaRouter from "koa-router";
import koa from "koa";
import * as R from "ramda";

const passRoutes = (func: Function) => (
  ctx: koa.Context,
  next: () => Promise<any>
) => {
  // all error handling will go to error handle middleware
  const params = Object.assign(
    {},
    ctx.request.query,
    ctx.params,
    ctx.request.body
  );
  // console.log('params', ctx.request);
  ctx.type = "application/json";
  return Promise.resolve(func(params, ctx))
    .then(values => {
      ctx.body = Object.assign(
        {
          code: 1,
          success: true
        },
        R.isEmpty(values) ? null : { ...values }
      );
    })
    .then(() => next());
};

export class Router extends koaRouter {
  constructor(opt?: koaRouter.IRouterOptions | undefined) {
    super(opt);
  }
  public setRoute(
    path: string,
    method: "get" | "put" | "post" | "patch" | "delete" | "del",
    func: Function
  ): koaRouter {
    return this[method](path, passRoutes(func));
  }
}
