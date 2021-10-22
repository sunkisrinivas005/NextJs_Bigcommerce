import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
const koaBody = require("koa-body");
const logger = require("../logger.js");
const session = require("koa-session");
const serve = require("koa-static");
var rp = require("request-promise");
const mount = require("koa-mount");
const fs = require("fs");
var http = require("http");
var https = require("https");

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 443;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

console.log(process.env.SCOPES.split(","), "test");

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );
  //server.use(verifyRequest());
  const handleRequest = async (ctx) => {
    //console.log("CTX", ctx);
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  const handleDeleteRequest = (ctx, next) => {
    console.log(ctx.query.shop, "ctx.query.shop");
    next();
  };

  router.get("/", async (ctx) => {
    console.log("Shop Initialization Method Called");
    //console.log("CTX", ctx);
    //const shop = process.env.SHOP;
    const shop = ctx.query.shop;
    console.log("Shop", shop);
    console.log("Active Shopify", ACTIVE_SHOPIFY_SHOPS);
    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  router.get("/hello", verifyRequest(), async (ctx) => {
    ctx.body = "Hello";
  });

  const options = {
    key: fs.readFileSync("./cert/server.key"),
    cert: fs.readFileSync("./cert/server.cert"),
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(ctx, `Webhook processed, returned status code 200`);
    } catch (error) {
      logger.error("Whooops! This broke with error: ", error);
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", verifyRequest(), handleRequest); // Everything else must have sessions

  //GDPR Mandatory Webhooks
  router.post(
    "/webhook/customers/data_request",
    koaBody(),
    handleDeleteRequest,
    (ctx, next) => {
      const shop = ctx.request.body.shop_domain;
      if (!shop) {
        ctx.throw(400, "cant find shop name");
      }
      ctx.status = 200;
      ctx.body = {
        status: 200,
        message: "records deleted successfully",
      };
      next();
    }
  );
  router.post("/webhook/customers/redact", koaBody(), (ctx, next) => {
    const shop = ctx.request.body.shop_domain;
    if (!shop) {
      ctx.throw(400, "cant find shop name");
    }
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: "Records deleted successfully",
    };
    next();
  });
  router.post("/webhook/shop/redact", koaBody(), async (ctx, next) => {
    console.log(ctx.request, "ctx.request");
    const shop = ctx.request.body.shop_domain;
    if (!shop) {
      ctx.throw(400, "cant find shop name");
    }
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: "Records deleted successfully",
    };
  });
  //server.use(async (ctx) => {
  //console.log("CALLED 1");

  //   await handle(ctx.req, ctx.res);

  //    ctx.respond = false;
  //  ctx.res.statusCode = 200;
  //});

  server.use(mount("/public", serve("./public")));
  server.use(router.routes());
  //server.proxy = true;
  let serverCallback = server.callback();
  try {
    var httpsServer = https.createServer(options, serverCallback);
    httpsServer.listen(port, function (err) {
      if (!!err) {
        console.error("HTTPS server FAIL: ", err, err && err.stack);
      } else {
        logger.info(`Express.js listening on port {port}.`);
        console.log(`HTTPS server OK: https://localhost:${port}`);
      }
    });
  } catch (ex) {
    logger.error("Whooops! This broke with error: ", ex);
    console.error("Failed to start HTTPS server\n", ex, ex && ex.stack);
  }
});
