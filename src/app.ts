import { Router } from "@oak/oak/router";
import { route, RouteContext } from "jsr:@oak/oak/serve";
import { Application } from "jsr:@oak/oak/application";

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`,
  );
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Hello World!
const router = new Router();

router.get("/:id", route((_req : Request, ctx): Response => {
  console.log(ctx.params.id);
  return Response.json({ title: "hello world", id: ctx.params.id });
}));

app.use(router.routes());

await app.listen({ port: 8000 });
