import boom from "@hapi/boom";
import logger from "../../../utils/logger/index.js";

/**
 * Error handling middleware
 * Converts errors to Boom format and returns standardized JSON response
 * @example throw boom.notFound("User not found", "UserNotFound")
 * @type {import("express").ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars -- next is required so that this is recognized as an error handler
export default (err, _req, res, _next) => {
	const {
		output: {
			statusCode,
			payload,
		},
		data
	} = boom.boomify(err);

	if (statusCode >= 500) {
		// We don't want to log 4xx errors
		logger.error(err);
	}

	const {
		statusCode: code,
		message,
		error: type,
	} = payload;

	const error = {
		code,
		message,
		type,
		data: data === null ? undefined : data,
	};

	res.status(statusCode).json({
		success: false,
		service: process.env.SERVICE_NAME,
		error
	});
};
