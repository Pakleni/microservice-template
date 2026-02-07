import Redis from "ioredis";

/**
 * Redis client instance
 * @type {import("ioredis").Redis}
 */
const keystore = new Redis(process.env.REDIS_URL);

export default keystore;
