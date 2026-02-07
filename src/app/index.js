import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import logger from "../utils/logger/index.js";
import routes from "../api/routes/index.js";
import errorMiddleware from "../api/middlewares/error/index.js";

const app = express();

app.use(helmet());
app.use(pinoHttp({ logger, useLevel: "debug" }));
app.use(express.json());

// Register routes
app.use("/", routes);

// Error handling
app.use(errorMiddleware);

export default app;
