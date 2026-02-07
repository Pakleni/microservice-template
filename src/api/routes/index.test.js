import { expect } from "chai";
import request from "supertest";

import app from "../../app/index.js";

describe("Routes", () => {
	describe("Authentication", () => {
		it("should return 401 for protected routes without token", async () => {
			const res = await request(app).get("/some-protected-route");

			expect(res.status).to.equal(401);
		});

		it("should return 404 for protected routes with token", async () => {
			const res = await request(app)
				.get("/some-protected-route")
				.set("Authorization", `Bearer ${process.env.TOKEN}`);

			expect(res.status).to.equal(404);
		});
	});
});
