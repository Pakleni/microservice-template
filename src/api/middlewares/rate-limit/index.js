import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import keystore from "../../../utils/keystore/index.js";

const limiter = rateLimit({
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
	limit: parseInt(process.env.RATE_LIMIT_MAX) || 100,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	ipv6Subnet: 56,
	skip: (req) => req.path.startsWith("/health") || req.path === "/metrics",
	store: new RedisStore({
		sendCommand: (command, ...args) =>
			keystore.call(command, ...args),
	}),
});

export default limiter;