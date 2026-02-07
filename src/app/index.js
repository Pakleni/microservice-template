import express from "express";
import morgan from "morgan";

import routes from "../api/routes/index.js";
import errorMiddleware from "../api/middlewares/error/index.js";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());

// Register routes
app.use("/", routes);

// Error handling
app.use(errorMiddleware);

export default app;
