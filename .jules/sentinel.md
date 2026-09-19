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

## 2026-08-30 - Authenticate External Write Proxies
**Vulnerability:** Express endpoints that proxy GitHub issue creation and Slack/Discord messages can otherwise be abused as unauthenticated outbound proxies using the application's configured integration credentials.
**Learning:** Any endpoint that performs third-party write operations on behalf of callers must enforce application-level authentication before invoking the provider API.
**Prevention:** Require a private `x-api-key` matching `API_KEY` on all external write-proxy routes and cover both authenticated and rejected requests with automated tests.
## 2024-05-24 - Missing Authentication on Sensitive Endpoints
**Vulnerability:** The Express backend exposed several sensitive endpoints (`/api/assistant/chat`, `/api/workflow/create`, `/api/workflow/sync`) that process incoming data and interact with external APIs (like Gemini) without authentication, making them vulnerable to unauthorized access and resource abuse.
**Learning:** Endpoints that consume third-party API quotas or mutate state must always be protected. While a custom `requireAuth` middleware existed in the file, it wasn't applied to all POST endpoints. Tests using `supertest` can verify endpoint protection by asserting `401 Unauthorized` when an API key is missing.
**Prevention:** Ensure all state-mutating or cost-incurring endpoints are wrapped with an authentication middleware (`requireAuth`). Always write unit tests that explicitly verify unauthenticated access is rejected for these endpoints.
## 2024-05-30 - [Fix timing attack vulnerability in API key verification]
**Vulnerability:** Timing attack vulnerability in `requireAuth` middleware due to unsafe string comparison.
**Learning:** `crypto.timingSafeEqual` should be used instead of `!==` to compare secrets. Also, when using `crypto.timingSafeEqual` in Node.js to compare secrets, strictly ensure you check the byte lengths of the generated `Buffer` objects, rather than the lengths of the original strings, to avoid errors or timing leaks with multibyte characters.
**Prevention:** Use `crypto.timingSafeEqual` for sensitive string comparisons, and always convert strings to Buffers first and check their byte lengths before comparison.
## 2024-05-31 - [Fix Command Injection and Path Handling Vulnerability]
**Vulnerability:** The Express backend used `child_process.exec` with interpolated strings to execute python scripts, making it vulnerable to command injection and path handling errors if the directory path contained spaces or special characters.
**Learning:** `child_process.execFile` should be used instead of `exec` to bypass the shell entirely and prevent command injection when dynamically constructing paths, avoiding issues with spaces.
**Prevention:** Always use `execFile` with arguments as an array rather than `exec` with interpolated command strings for executing scripts.
