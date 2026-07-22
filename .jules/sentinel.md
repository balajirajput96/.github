## 2024-07-08 - Prevent Information Leakage in API Error Responses
**Vulnerability:** Fastapi's `HTTPException` was returning the raw exception string `str(e)` on a 500 error, exposing potentially sensitive internal server details or stack traces to the end user.
**Learning:** This is a common pattern when developers quickly add a try-catch block but forget that error details returned to the client can leak sensitive architecture information, path structures, or database details.
**Prevention:** Always log the verbose error details internally (e.g., using `logger.error`), but return a generic, non-descriptive error message (e.g., "An internal error occurred") in the HTTP response.
## 2026-07-22 - Fix IP-based Rate Limiting Behind Reverse Proxy
**Vulnerability:** The Express backend was using an IP-based rate limiter (`req.ip`) without `app.set('trust proxy', 1);` configured. When deployed behind a reverse proxy (like Heroku or Nginx), `req.ip` returns the proxy's IP address instead of the actual client's IP. This means all requests share the same rate limit bucket, causing legitimate users to be blocked (DoS) or attackers to bypass limits.
**Learning:** This architectural gap occurs when moving an app from local development to production. Express needs explicit instruction to trust the headers (like `X-Forwarded-For`) provided by the proxy.
**Prevention:** Always verify if an application is running behind a reverse proxy when implementing IP-based security mechanisms (rate limiting, auditing, geolocation) and configure `trust proxy` accordingly.
