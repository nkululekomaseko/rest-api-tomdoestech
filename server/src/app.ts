import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes/routes";
import deserializeUser from "./middleware/deserializeUser";
import cors from "cors";
import cookieParser from "cookie-parser";

const port = config.get<number>("port");

const app = express();
app.use(
  cors({
    origin: config.get("origin"),
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  routes(app);
});
