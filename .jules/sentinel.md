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

## 2026-08-23 - Prevent SSRF and Path Traversal in Express Proxies
**Vulnerability:** The Express backend in `web-app/server/index.js` directly interpolated user-provided URL parameters (like `req.params.owner`) into external API requests (e.g., `/users/${owner}/repos`) without validation. Express automatically decodes characters like `%2F` (`/`), allowing attackers to manipulate the external request path.
**Learning:** This is a surprising architectural gap where standard parameter decoding combined with unvalidated proxying creates Server-Side Request Forgery (SSRF) and path traversal risks. It highlights the necessity of strictly validating URL parameters used to build downstream requests.
**Prevention:** Strictly validate any user-provided URL parameters used in downstream requests against an expected regex format (e.g., `/^[a-zA-Z0-9_.-]+$/`) to ensure they only contain safe characters.
