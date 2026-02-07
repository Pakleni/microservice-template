import { expect } from "chai";
import request from "supertest";
import express from "express";
import boom from "@hapi/boom";

import errorMiddleware from "./index.js";

const createApp = (errorToThrow) => {
	const app = express();
	app.get("/", () => {
		throw errorToThrow;
	});
	app.use(errorMiddleware);
	return app;
};

describe("Error Middleware", () => {
	it("should handle boom errors with correct status", async () => {
		const app = createApp(boom.notFound("User not found"));
		const res = await request(app).get("/");

		expect(res.status).to.equal(404);
		expect(res.body.success).to.equal(false);
		expect(res.body.error.code).to.equal(404);
		expect(res.body.error.message).to.equal("User not found");
		expect(res.body.error.type).to.equal("Not Found");
	});

	it("should include custom data from boom error", async () => {
		const app = createApp(boom.badRequest("Invalid input", "ValidationError"));
		const res = await request(app).get("/");

		expect(res.status).to.equal(400);
		expect(res.body.error.data).to.equal("ValidationError");
	});

	it("should convert non-boom errors to 500", async () => {
		const app = createApp(new Error("Something went wrong"));
		const res = await request(app).get("/");

		expect(res.status).to.equal(500);
		expect(res.body.success).to.equal(false);
		expect(res.body.error.type).to.equal("Internal Server Error");
	});

	it("should not include data when boom data is null", async () => {
		const app = createApp(boom.unauthorized());
		const res = await request(app).get("/");

		expect(res.status).to.equal(401);
		expect(res.body.error.data).to.be.undefined;
	});

	it("should include service name at top level", async () => {
		const app = createApp(boom.badRequest());
		const res = await request(app).get("/");

		expect(res.body.service).to.equal(process.env.SERVICE_NAME);
	});
});
