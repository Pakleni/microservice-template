import crypto from "node:crypto";
import boom from "@hapi/boom";

/**
 * Bearer token authentication middleware
 * Validates Authorization header against process.env.TOKEN
 * @type {import("express").RequestHandler}
 */
function auth(req, _res, next) {
	if (req.headers?.authorization) {
		const [prefix, token] = req.headers.authorization.split(" ");
		if (
			prefix?.toLowerCase() === "bearer" &&
			token &&
			token.length === process.env.TOKEN.length &&
			crypto.timingSafeEqual(Buffer.from(token), Buffer.from(process.env.TOKEN))
		) {
			return next();
		}
	}

	return next(boom.unauthorized());
}

export default auth;
