import "dotenv/config";

export default {
	client: "pg",
	connection: process.env.POSTGRES_URL
};
