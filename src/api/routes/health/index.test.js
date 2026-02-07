import { expect } from "chai";
import request from "supertest";

import app from "../../../app/index.js";

describe("Health Routes", () => {
	describe("GET /health", () => {
		it("should return 200 with success true", async () => {
			const res = await request(app).get("/health");

			expect(res.status).to.equal(200);
			expect(res.body.success).to.equal(true);
		});

		it("should not require authentication", async () => {
			const res = await request(app).get("/health");

			expect(res.status).to.equal(200);
		});
	});

	describe("GET /health/ready", () => {
		it("should return 200 when all services are connected", async () => {
			const res = await request(app).get("/health/ready");

			expect(res.status).to.equal(200);
			expect(res.body.success).to.equal(true);
			expect(res.body.checks).to.have.property("db", true);
			expect(res.body.checks).to.have.property("keystore", true);
		});

		it("should not require authentication", async () => {
			const res = await request(app).get("/health/ready");

			expect(res.status).to.equal(200);
		});

		it("should return checks object with service status", async () => {
			const res = await request(app).get("/health/ready");

			expect(res.body.checks).to.be.an("object");
			expect(res.body.checks).to.have.property("db");
			expect(res.body.checks).to.have.property("keystore");
		});
	});
});
