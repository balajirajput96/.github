## 2024-07-08 - Prevent Information Leakage in API Error Responses
**Vulnerability:** Fastapi's `HTTPException` was returning the raw exception string `str(e)` on a 500 error, exposing potentially sensitive internal server details or stack traces to the end user.
**Learning:** This is a common pattern when developers quickly add a try-catch block but forget that error details returned to the client can leak sensitive architecture information, path structures, or database details.
**Prevention:** Always log the verbose error details internally (e.g., using `logger.error`), but return a generic, non-descriptive error message (e.g., "An internal error occurred") in the HTTP response.

## 2024-05-24 - [Enforce length constraints on Pydantic lists]
**Vulnerability:** Fast API Pydantic model (`PredictionInput`) lacked a maximum length on its list of floats `features`. This allows an attacker to send an arbitrarily large JSON array of floats, leading to unbounded memory allocation and potential Denial of Service (DoS/OOM).
**Learning:** This is a recurring pattern in ML API endpoints where arrays are passed but bounds are not checked before casting to numpy arrays. Pydantic `List` typing does not enforce length limits by default.
**Prevention:** Always use Pydantic `Field(..., max_length=X)` when defining array or string inputs on public endpoints to set a reasonable upper bound and fail safely before memory exhaustion.
