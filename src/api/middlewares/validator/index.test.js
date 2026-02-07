import { expect } from "chai";
import request from "supertest";
import express from "express";
import Joi from "joi";

import Validator from "./index.js";
import errorMiddleware from "../error/index.js";

const createApp = (schema, path = "/test") => {
	const app = express();
	app.use(express.json());
	app.post(path, Validator(schema), (req, res) => {
		res.json({
			success: true,
			validated: req.validated
		});
	});
	app.use(errorMiddleware);
	return app;
};

describe("Validator Middleware", () => {
	describe("body validation", () => {
		const schema = Joi.object({
			body: Joi.object({
				name: Joi.string().required(),
				age: Joi.number()
			})
		});

		it("should pass with valid body", async () => {
			const app = createApp(schema);
			const res = await request(app)
				.post("/test")
				.send({ name: "John", age: 25 });

			expect(res.status).to.equal(200);
			expect(res.body.validated.body.name).to.equal("John");
			expect(res.body.validated.body.age).to.equal(25);
		});

		it("should fail when required field is missing", async () => {
			const app = createApp(schema);
			const res = await request(app)
				.post("/test")
				.send({ age: 25 });

			expect(res.status).to.equal(422);
			expect(res.body.success).to.equal(false);
		});

		it("should fail when body is empty but has required fields", async () => {
			const app = createApp(schema);
			const res = await request(app)
				.post("/test")
				.send({});

			expect(res.status).to.equal(422);
		});

		it("should strip unknown fields", async () => {
			const app = createApp(schema);
			const res = await request(app)
				.post("/test")
				.send({ name: "John", secret: "password" });

			expect(res.status).to.equal(200);
			expect(res.body.validated.body.name).to.equal("John");
			expect(res.body.validated.body.secret).to.be.undefined;
		});
	});

	describe("params validation", () => {
		const schema = Joi.object({
			params: Joi.object({
				id: Joi.number().required()
			})
		});

		it("should pass with valid params", async () => {
			const app = createApp(schema, "/:id");
			const res = await request(app)
				.post("/123")
				.send({});

			expect(res.status).to.equal(200);
			expect(res.body.validated.params.id).to.equal(123);
		});

		it("should fail with invalid param type", async () => {
			const app = createApp(schema, "/:id");
			const res = await request(app)
				.post("/abc")
				.send({});

			expect(res.status).to.equal(422);
		});
	});

	describe("query validation", () => {
		const schema = Joi.object({
			query: {
				limit: Joi.number().default(10)
			}
		});

		it("should apply default values", async () => {
			const app = createApp(schema);
			const res = await request(app)
				.post("/test")
				.send({});

			expect(res.status).to.equal(200);
			expect(res.body.validated.query.limit).to.equal(10);
		});

		it("should use provided value over default", async () => {
			const app = createApp(schema);
			const res = await request(app)
				.post("/test?limit=50")
				.send({});

			expect(res.status).to.equal(200);
			expect(res.body.validated.query.limit).to.equal(50);
		});
	});

	describe("combined validation", () => {
		const schema = Joi.object({
			params: Joi.object({
				id: Joi.number().required()
			}),
			body: Joi.object({
				name: Joi.string().required()
			}),
			query: Joi.object({
				page: Joi.number().default(1)
			})
		});

		it("should validate all sources together", async () => {
			const app = createApp(schema, "/:id");
			const res = await request(app)
				.post("/456?page=2")
				.send({ name: "Test" });

			expect(res.status).to.equal(200);
			expect(res.body.validated.params.id).to.equal(456);
			expect(res.body.validated.body.name).to.equal("Test");
			expect(res.body.validated.query.page).to.equal(2);
		});
	});

	describe("top-level required behavior", () => {
		it("should require body when defined in schema even if inner fields are optional", async () => {
			const schema = Joi.object({
				body: Joi.object({
					name: Joi.string()
				})
			});
			const app = createApp(schema);

			// Empty body should fail because body.name is required
			const res = await request(app)
				.post("/test")
				.send();

			expect(res.status).to.equal(422);
			expect(res.body.success).to.equal(false);
			expect(res.body.error.message).to.equal("\"body\" is required");
		});
	});

	describe("req.validated", () => {
		it("should attach validated values to req.validated", async () => {
			const schema = Joi.object({
				body: Joi.object({
					name: Joi.string().required()
				})
			});
			const app = createApp(schema);

			const res = await request(app)
				.post("/test")
				.send({ name: "Test" });

			expect(res.status).to.equal(200);
			expect(res.body.validated).to.have.property("body");
			expect(res.body.validated.body.name).to.equal("Test");
		});
	});
});
