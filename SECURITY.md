# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in the Learning Management System (`LMS`), please submit a report to the security maintainers.

## Security Controls

1. **Authentication & Authorization**:
   - JWT tokens are signed using `JWT_SECRET` and transmitted securely via HttpOnly cookies or Authorization headers.
   - Password hashing is enforced using `bcryptjs` with salt rounds.
2. **Input Sanitization & Protection**:
   - Express backend implements `helmet` HTTP header security, `express-rate-limit` DDoS protection, `express-mongo-sanitize` for NoSQL injection prevention, and `xss-clean` for cross-site scripting mitigation.
3. **Environment Security**:
   - `JWT_SECRET`, MongoDB URIs, and certificate configuration must reside exclusively in `.env` files and never be committed to git.
