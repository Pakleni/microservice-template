/* eslint-disable no-console */

/**
 * Logger utility
 * Basic console wrapper - swap implementation for production (e.g., pino)
 */
const logger = {
	/**
	 * Log info message
	 * @param {...any} args
	 */
	info: (...args) => {
		console.log(...args);
	},
	/**
	 * Log error
	 * @param {Error} error
	 */
	error: (error) => {
		console.error(error);
	}
};

export default logger;
