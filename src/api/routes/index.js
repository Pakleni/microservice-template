import express from "express";

import auth from "../middlewares/auth/index.js";
import health from "./health/index.js";

const router = express.Router({ mergeParams: true });

router.use("/health", health);

router.use(auth);

export default router;
