import { expect } from "chai";
import request from "supertest";
import express from "express";

import auth from "./index.js";
import errorMiddleware from "../error/index.js";

const createApp = () => {
	const app = express();
	app.use(auth);
	app.get("/", (_req, res) => res.json({ success: true }));
	app.use(errorMiddleware);
	return app;
};

describe("Auth Middleware", () => {
	it("should return 401 when no authorization header", async () => {
		const app = createApp();
		const res = await request(app).get("/");

		expect(res.status).to.equal(401);
		expect(res.body.success).to.equal(false);
	});

	it("should return 401 when authorization header has wrong prefix", async () => {
		const app = createApp();
		const res = await request(app)
			.get("/")
			.set("Authorization", `Basic ${process.env.TOKEN}`);

		expect(res.status).to.equal(401);
	});

	it("should return 401 when token is invalid", async () => {
		const app = createApp();
		const res = await request(app)
			.get("/")
			.set("Authorization", "Bearer wrong-token");

		expect(res.status).to.equal(401);
	});

	it("should return 401 when token has wrong length", async () => {
		const app = createApp();
		const res = await request(app)
			.get("/")
			.set("Authorization", "Bearer short");

		expect(res.status).to.equal(401);
	});

	it("should pass when token is valid", async () => {
		const app = createApp();
		const res = await request(app)
			.get("/")
			.set("Authorization", `Bearer ${process.env.TOKEN}`);

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(true);
	});
});
