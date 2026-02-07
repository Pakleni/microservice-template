import pg from "pg";
import knex from "knex";

// Parse INT8, FLOAT8, NUMERIC as numbers instead of strings
pg.types.setTypeParser(pg.types.builtins.INT8, parseInt);
pg.types.setTypeParser(pg.types.builtins.FLOAT8, parseFloat);
pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (date) => new Date(date));

/**
 * Knex database instance
 * @type {import("knex").Knex}
 */
const db = knex({
	client: "pg",
	connection: process.env.POSTGRES_URL,
	pool: { min: 0, max: 10 }
});

export default db;
