import "dotenv/config";

const required = [
	"SERVICE_NAME",
	"TOKEN",
	"PORT",
	"POSTGRES_URL",
	"REDIS_URL",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
	throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}
