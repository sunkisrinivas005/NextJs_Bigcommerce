import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
// import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import BigCommerce from 'node-bigcommerce';
import jwt from 'jsonwebtoken';
import RP from 'request-promise';
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
const port = 3001;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

const { AUTH_CALLBACK, CLIENT_ID, CLIENT_SECRET, JWT_KEY } = process.env;


const bigcommerce = new BigCommerce({
  logLevel: 'info',
  clientId: CLIENT_ID,
  secret: CLIENT_SECRET,
  callback: AUTH_CALLBACK,
  responseType: 'json',
  headers: { 'Accept-Encoding': '*' },
  apiVersion: 'v3',
});

const bigcommerceSigned = new BigCommerce({
  secret: CLIENT_SECRET,
  responseType: 'json',
});


export function encodePayload({ user, owner, ...session }) {
  const contextString = session?.context ?? session?.sub;
  const context = contextString.split('/')[1] || '';

  return jwt.sign({ context, user, owner }, JWT_KEY, { expiresIn: '24h' });
}
// Verifies JWT for getSession (product APIs)
export function decodePayload(encodedContext) {
  return jwt.verify(encodedContext, JWT_KEY);
}

// Create BigCommerce instance
// https://github.com/bigcommerce/node-bigcommerce/

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  const handleDeleteRequest = (ctx) => {
    console.log(ctx.query.shop, "ctx.query.shop");
  };

  router.get("/api/auth", async (ctx) => {
    console.log("Shop Initialization Method Called");
    const shop = ctx.query;
    let response = await bigcommerce.authorize(shop);
    console.log(response, 'response')
    const encodedContext = encodePayload(response);
    console.log(encodedContext, 'response');
    // app.render(req, res, '/', encodedContext);
    ctx.redirect(`/?context=${encodedContext}`);
  });


  router.get('/api/get-script-tags', async(ctx) => {
    console.log("Get script tag intialised");
    const shop = ctx.query;
    const details = decodePayload(shop);
    console.log(details, 'details');
    const store_hash = details.context.split('/')[1];
    const access_token = details.access_token;
    let response = await rp(`https://api.bigcommerce.com/stores/${store_hash}/v3/content/scripts`, {
      headers: {
          "accept": "application/json",
          "Content-type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          'X-Auth-Token': access_token
      }
    })
    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: "records fetched successfully",
      data: response.data
    };
  })

  router.get("/api/load", async (ctx) => {
    console.log("Shop Initialization Method Called12");
    const {signed_payload} = ctx.query;
    console.log("signed_payload_jwt", signed_payload);
    let session = await bigcommerceSigned.verify(signed_payload);
    console.log(session, 'response')
    const encodedContext = encodePayload(session);
    ctx.redirect(`/?context=${encodedContext}`);
  });

  const options = {
    key: fs.readFileSync("./cert/server.key"),
    cert: fs.readFileSync("./cert/server.cert"),
  };

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", handleRequest); // Everything else must have sessions

  server.use(mount("/public", serve("./public")));
  server.use(router.routes());

  server.listen(port, () => console.log('listening port', port))
  //server.proxy = true;
  // let serverCallback = server.callback();
  // try {
  //   var httpsServer = https.createServer(options, serverCallback);
  //   httpsServer.listen(port, function (err) {
  //     if (!!err) {
  //       console.error("HTTPS server FAIL: ", err, err && err.stack);
  //     } else {
  //       logger.info(`Express.js listening on port {port}.`);
  //       console.log(`HTTPS server OK: https://localhost:${port}`);
  //     }
  //   });
  // } catch (ex) {
  //   logger.error("Whooops! This broke with error: ", ex);
  //   console.error("Failed to start HTTPS server\n", ex, ex && ex.stack);
  // }
});
