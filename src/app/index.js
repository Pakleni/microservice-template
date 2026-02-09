import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import cors from "cors";
import compression from "compression";
import { randomUUID } from "node:crypto";
import boom from "@hapi/boom";

import logger from "../utils/logger/index.js";
import routes from "../api/routes/index.js";
import errorMiddleware from "../api/middlewares/error/index.js";
import limiter from "../api/middlewares/rate-limit/index.js";

const app = express();

app.disable("x-powered-by");

// trust first proxy
if (process.env.TRUST_PROXY == "1") {
	app.set("trust proxy", 1);
}

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(compression());
app.use(pinoHttp({
	logger,
	useLevel: "debug",
	genReqId: (req) => req.headers["x-request-id"] || randomUUID(),
}));
app.use((req, res, next) => {
	res.setHeader("X-Request-ID", req.id);
	next();
});
app.use(express.json({ limit: "100kb" }));

// Register routes
app.use("/", routes);

// 404
app.use(() => {
	throw boom.notFound();
});

// Error handling
app.use(errorMiddleware);

export default app;
