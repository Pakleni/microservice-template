import { config } from "dotenv";
config({ path: "./.env.test" });

import db from "./src/utils/db/index.js";

export const mochaHooks = {
	async beforeAll() {
		await db.migrate.latest();
	}
};
