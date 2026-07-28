## 2024-07-08 - Prevent Information Leakage in API Error Responses
**Vulnerability:** Fastapi's `HTTPException` was returning the raw exception string `str(e)` on a 500 error, exposing potentially sensitive internal server details or stack traces to the end user.
**Learning:** This is a common pattern when developers quickly add a try-catch block but forget that error details returned to the client can leak sensitive architecture information, path structures, or database details.
**Prevention:** Always log the verbose error details internally (e.g., using `logger.error`), but return a generic, non-descriptive error message (e.g., "An internal error occurred") in the HTTP response.## 2026-07-28 - Mitigate XSS in Express Server CSP
**Vulnerability:** The Express backend `web-app/server/index.js` used a permissive Content-Security-Policy containing `'unsafe-inline'` and `'unsafe-eval'` in the `script-src` directive, making the application highly susceptible to Cross-Site Scripting (XSS).
**Learning:** Default or quickly drafted CSPs often include unsafe directives for convenience during development, which leak into production configurations.
**Prevention:** Establish a baseline strict CSP in standard project templates and ensure automated security scanning (or code review) explicitly flags `unsafe-inline` and `unsafe-eval` as required findings to remove before deployment.
