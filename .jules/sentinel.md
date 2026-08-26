## 2024-07-08 - Prevent Information Leakage in API Error Responses
**Vulnerability:** Fastapi's `HTTPException` was returning the raw exception string `str(e)` on a 500 error, exposing potentially sensitive internal server details or stack traces to the end user.
**Learning:** This is a common pattern when developers quickly add a try-catch block but forget that error details returned to the client can leak sensitive architecture information, path structures, or database details.
**Prevention:** Always log the verbose error details internally (e.g., using `logger.error`), but return a generic, non-descriptive error message (e.g., "An internal error occurred") in the HTTP response.## 2026-07-28 - Mitigate XSS in Express Server CSP
**Vulnerability:** The Express backend `web-app/server/index.js` used a permissive Content-Security-Policy containing `'unsafe-inline'` and `'unsafe-eval'` in the `script-src` directive, making the application highly susceptible to Cross-Site Scripting (XSS).
**Learning:** Default or quickly drafted CSPs often include unsafe directives for convenience during development, which leak into production configurations.
**Prevention:** Establish a baseline strict CSP in standard project templates and ensure automated security scanning (or code review) explicitly flags `unsafe-inline` and `unsafe-eval` as required findings to remove before deployment.
## 2024-08-15 - Unbounded Collections in Pydantic Models (DoS Risk)
**Vulnerability:** The FastAPI endpoint `/predict` accepted a `List[float]` without length constraints in `PredictionInput`. A malicious user could send an excessively large list (e.g., millions of items), causing the application to consume excessive memory leading to a Denial of Service (DoS) attack.
**Learning:** This is a common oversight when defining Pydantic schemas. By default, unbounded iterables (Lists, Dicts, Sets) lack size limits, making endpoints that deserialize large payloads vulnerable to resource exhaustion.
**Prevention:** Constrain collections and iterables in Pydantic schemas using `Field(..., max_length=N)` where N represents a reasonable, expected upper bound for the business logic.
## 2024-05-20 - Path Traversal / SSRF in Express URL Parameters
**Vulnerability:** Unvalidated route parameters (`req.params`) passed directly to external API calls.
**Learning:** Express decodes URL encoded characters (like %2F) by default. Passing these directly to Axios requests can lead to path traversal and SSRF against the upstream API.
**Prevention:** Always validate and sanitize route parameters (e.g., using a strict regex for valid characters) before using them to construct external request URLs.
