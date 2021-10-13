import Koa from "koa";
import koaBody from "koa-body";
import Router from "koa-router";
import { uploadFile } from "./images/upload";

const app = new Koa();

app.use(koaBody({ multipart: true }));

const router = new Router({ prefix: "/api" });

router.post("/images/upload", uploadFile);
router.get("/", async (ctx, next) => {
  ctx.body = "Howdy";
  await next();
});
// router.get("/documents/download", downloadArchive);
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
