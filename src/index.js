import "./config/index.js";

import util from "util";

import app from "./app/index.js";
import logger from "./utils/logger/index.js";
import db from "./utils/db/index.js";
import keystore from "./utils/keystore/index.js";

const server = app.listen(process.env.PORT, () => {
	logger.info(`${process.env.SERVICE_NAME} running on port ${process.env.PORT}`);
});

server.headersTimeout = 10 * 1000;
server.requestTimeout = 30 * 1000;
server.keepAliveTimeout = 65 * 1000;
server.setTimeout(120 * 1000, (socket) => {
	logger.warn("Socket timeout, destroying connection");
	socket.destroy();
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

let isShuttingDown = false;
function shutdown() {
	if (isShuttingDown) return;
	isShuttingDown = true;

	logger.debug("Shutting down...");

	Promise.all([
		db.destroy(),
		keystore.quit(),
		util.promisify(server.close.bind(server))()
	]).then(() => {
		process.exit(0);
	}).catch((err) => {
		logger.error(err);
		process.exit(1);
	});
}
