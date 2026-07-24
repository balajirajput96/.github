## 2024-07-08 - Prevent Information Leakage in API Error Responses
**Vulnerability:** Fastapi's `HTTPException` was returning the raw exception string `str(e)` on a 500 error, exposing potentially sensitive internal server details or stack traces to the end user.
**Learning:** This is a common pattern when developers quickly add a try-catch block but forget that error details returned to the client can leak sensitive architecture information, path structures, or database details.
**Prevention:** Always log the verbose error details internally (e.g., using `logger.error`), but return a generic, non-descriptive error message (e.g., "An internal error occurred") in the HTTP response.
## 2025-03-05 - Fix XSS Risk in Content-Security-Policy (CSP)
**Vulnerability:** The Content-Security-Policy header in the Express backend (`web-app/server/index.js`) allowed `'unsafe-inline'` and `'unsafe-eval'` in the `script-src` directive, mitigating the primary defense against Cross-Site Scripting (XSS) attacks.
**Learning:** Overly permissive CSP headers, often added during development for convenience, negate the security benefits of the header and expose the application to script injection attacks in production.
**Prevention:** Always strive for a strict CSP that explicitly denies unsafe inline scripts and evaluation unless absolutely required, and continuously review headers to ensure they align with the principle of least privilege.
