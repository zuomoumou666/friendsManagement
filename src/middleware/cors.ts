// copy from https://github.com/koajs/cors

"use strict";

/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 * @return {Function} cors middleware
 * @api public
 */
export default function(options: any) {
  const defaults = {
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH"
  };

  // tslint:disable-next-line:no-param-reassign
  const finalOpts = Object.assign({}, defaults, options);

  if (Array.isArray(finalOpts.exposeHeaders)) {
    finalOpts.exposeHeaders = finalOpts.exposeHeaders.join(",");
  }

  if (Array.isArray(finalOpts.allowMethods)) {
    finalOpts.allowMethods = finalOpts.allowMethods.join(",");
  }

  if (Array.isArray(finalOpts.allowHeaders)) {
    finalOpts.allowHeaders = finalOpts.allowHeaders.join(",");
  }

  if (finalOpts.maxAge) {
    finalOpts.maxAge = String(finalOpts.maxAge);
  }

  finalOpts.credentials = !!finalOpts.credentials;
  finalOpts.keepHeadersOnError =
    finalOpts.keepHeadersOnError === undefined ||
    !!finalOpts.keepHeadersOnError;

  return function cors(ctx: any, next: any) {
    // If the Origin header is not present terminate this set of steps.
    // The request is outside the scope of this specification.
    const requestOrigin = ctx.get("Origin");

    // Always set Vary header
    // https://github.com/rs/cors/issues/10
    ctx.vary("Origin");

    if (!requestOrigin) {
      return next();
    }

    let origin;

    if (typeof finalOpts.origin === "function") {
      // FIXME: origin can be promise
      origin = finalOpts.origin(ctx);
      if (!origin) {
        return next();
      }
    } else {
      origin = finalOpts.origin || requestOrigin;
    }

    const headersSet: any = {};

    function set(key: any, value: any) {
      ctx.set(key, value);
      headersSet[key] = value;
    }

    if (ctx.method !== "OPTIONS") {
      // Simple Cross-Origin Request, Actual Request, and Redirects
      set("Access-Control-Allow-Origin", origin);

      if (finalOpts.credentials === true) {
        set("Access-Control-Allow-Credentials", "true");
      }

      if (finalOpts.exposeHeaders) {
        set("Access-Control-Expose-Headers", finalOpts.exposeHeaders);
      }

      if (!finalOpts.keepHeadersOnError) {
        return next();
      }
      return next().catch((err: any) => {
        err.headers = Object.assign({}, err.headers, headersSet);
        throw err;
      });
    }
    // Preflight Request

    // If there is no Access-Control-Request-Method header or if parsing failed,
    // do not set any additional headers and terminate this set of steps.
    // The request is outside the scope of this specification.
    if (!ctx.get("Access-Control-Request-Method")) {
      // this not preflight request, ignore it
      return next();
    }

    ctx.set("Access-Control-Allow-Origin", origin);

    if (finalOpts.credentials === true) {
      ctx.set("Access-Control-Allow-Credentials", "true");
    }

    if (finalOpts.maxAge) {
      ctx.set("Access-Control-Max-Age", finalOpts.maxAge);
    }

    if (finalOpts.allowMethods) {
      ctx.set("Access-Control-Allow-Methods", finalOpts.allowMethods);
    }

    let allowHeaders = finalOpts.allowHeaders;
    if (!allowHeaders) {
      allowHeaders = ctx.get("Access-Control-Request-Headers");
    }
    if (allowHeaders) {
      ctx.set("Access-Control-Allow-Headers", allowHeaders);
    }

    ctx.status = 204;
    return next();
  };
}
