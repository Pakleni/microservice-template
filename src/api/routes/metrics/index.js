import express from "express";

import metrics from "../../../utils/metrics/index.js";

const router = express.Router({ mergeParams: true });

router.get("/", async (_req, res) => {
	res.set("Content-Type", metrics.register.contentType);
	res.send(await metrics.register.metrics());
});

export default router;
