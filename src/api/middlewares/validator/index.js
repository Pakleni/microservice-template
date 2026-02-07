import boom from "@hapi/boom";

/**
 * Validation middleware that validates req.body, req.params, and req.query
 * Validated values are stored in req.validated
 * @param {import("joi").ObjectSchema} inputSchema Joi schema with body, params, and/or query keys
 * @returns {import("express").RequestHandler}
 */
const Validator = (inputSchema) => {
	return (req, _res, next) => {
		// This is used to not accidentally allow an empty body
		const schemaKeys = inputSchema.describe().keys;
		const schema = inputSchema.fork(
			["body", "params", "query"].filter(x => schemaKeys[x]),
			(s) => s.required()
		);

		const { body, params, query } = req;
		const { value, error } = schema.validate({ body, params, query }, {
			stripUnknown: true,
		});

		if (error) {
			return next(boom.badData(error, "ValidationError"));
		}

		req.validated = value;

		next();
	};
};

export default Validator;
