import app from "./app";
import { serveStatic } from "hono/bun";
import feedback from "./routes/feedback";

app.use(
  "/*",
  serveStatic({
    root: "./public",
    rewriteRequestPath: (path) => path.replace(/^\//, ""),
  })
);

app.route("/", feedback);

export default app;
