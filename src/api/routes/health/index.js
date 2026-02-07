import express from "express";

import db from "../../../utils/db/index.js";
import keystore from "../../../utils/keystore/index.js";

const router = express.Router({ mergeParams: true });

// Liveness probe - process is running
router.get("/", (_req, res) => {
	res.json({ success: true });
});

// Readiness probe - dependencies are connected
router.get("/ready", async (_req, res) => {
	const checks = {
		db: false,
		keystore: false
	};

	try {
		await db.raw("SELECT 1");
		checks.db = true;
	} catch { /* connection failed */ }

	try {
		await keystore.ping();
		checks.keystore = true;
	} catch { /* connection failed */ }

	const success = Object.values(checks).every(Boolean);

	res.status(success ? 200 : 503).json({ success, checks });
});

export default router;
