# Microservice Template

A Node.js microservice boilerplate with Express 5, PostgreSQL, and Redis.

## Middlewares

### Authorization

Bearer token authentication with timing-safe comparison to prevent timing attacks. Designed for internal service-to-service communication. For external-facing APIs, consider extending with JWT validation.

### Validation

Joi-based request validation for body, params, and query. Populates `req.validated` with sanitized data—defaults applied, types coerced, and unknown fields stripped to prevent mass assignment vulnerabilities.

### Error Handling

Standardized JSON error responses using Boom. Internal errors are replaced with generic 500 responses to avoid leaking sensitive details. Each error includes the `SERVICE_NAME` to trace origin in distributed systems.

## Features

### Testing & CI

Integration tests run against real PostgreSQL and Redis via Docker Compose. Includes ready-to-use GitHub Actions and GitLab CI pipelines.

### Health Checks & Graceful Shutdown

Implements health checks and graceful shutdown per [Express documentation](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html). Liveness (`/health`) and readiness (`/health/ready`) probes verify database and Redis connectivity. On `SIGTERM`/`SIGINT`, closes the HTTP server, drains connections, and exits cleanly.

### Code Quality

ESLint 9 with Husky pre-commit hooks. Linting runs automatically before each commit to enforce consistent code style.
