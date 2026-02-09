# Microservice Template

A Node.js microservice boilerplate with Express 5, PostgreSQL, and Redis.

## Getting Started

Copy environment variables, install dependencies, run migrations, and start:
```bash
cp .env.example .env
yarn install
yarn migrate:docker
yarn start:docker
```

Run lint and tests:
```bash
yarn lint
yarn test
```

## Middlewares

### Authorization

Bearer token authentication with timing-safe comparison to prevent timing attacks. Designed for internal service-to-service communication. For external-facing APIs, consider extending with JWT validation.

### Validation

Joi-based request validation for body, params, and query. Populates `req.validated` with sanitized data—defaults applied, types coerced, and unknown fields stripped to prevent mass assignment vulnerabilities.

### Error Handling

Standardized JSON error responses using Boom. Internal errors are replaced with generic 500 responses to avoid leaking sensitive details. Each error includes the `SERVICE_NAME` to trace origin in distributed systems.

### Rate Limiting

Redis-backed rate limiting with configurable window and max requests. Health endpoints are excluded to ensure they always succeed. Configure via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX` environment variables.

## Features

### Testing & CI

Integration tests run against real PostgreSQL and Redis via Docker Compose. Includes ready-to-use GitHub Actions and GitLab CI pipelines.

### Prometheus Metrics

Exposes Prometheus metrics at `/metrics`. Includes default Node.js runtime metrics (memory, CPU, event loop, GC).

### Health Checks & Graceful Shutdown

Implements health checks and graceful shutdown per [Express documentation](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html). Liveness (`/health`) and readiness (`/health/ready`) probes verify database and Redis connectivity. On `SIGTERM`/`SIGINT`, closes the HTTP server, drains connections, and exits cleanly.

### Docker

Production-ready Dockerfile with non-root user and built-in HEALTHCHECK.

### Code Quality

ESLint 9 with Husky pre-commit hooks. Linting runs automatically before each commit to enforce consistent code style.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SERVICE_NAME` | Yes | Service identifier for logging and error responses |
| `TOKEN` | Yes | Bearer token for authentication |
| `PORT` | Yes | Server port |
| `POSTGRES_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `LOG_LEVEL` | No | Pino log level (default: info) |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window in ms (default: 900000) |
| `RATE_LIMIT_MAX` | No | Max requests per window (default: 100) |
| `TRUST_PROXY` | No | Set to `1` when behind a reverse proxy/load balancer |
