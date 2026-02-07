import "dotenv/config";

import app from "./app/index.js";
import logger from "./utils/logger/index.js";
import db from "./utils/db/index.js";
import keystore from "./utils/keystore/index.js";

const server = app.listen(process.env.PORT, () => {
	logger.info(`Running on port ${process.env.PORT}`);
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function shutdown() {
	logger.info("Shutting down...");

	server.close(() => {
		logger.info("HTTP server closed");
	});

	await Promise.all([
		db.destroy(),
		keystore.quit()
	]);

	process.exit(0);
}
