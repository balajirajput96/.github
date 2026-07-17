## 2024-07-08 - Prevent Information Leakage in API Error Responses
**Vulnerability:** Fastapi's `HTTPException` was returning the raw exception string `str(e)` on a 500 error, exposing potentially sensitive internal server details or stack traces to the end user.
**Learning:** This is a common pattern when developers quickly add a try-catch block but forget that error details returned to the client can leak sensitive architecture information, path structures, or database details.
**Prevention:** Always log the verbose error details internally (e.g., using `logger.error`), but return a generic, non-descriptive error message (e.g., "An internal error occurred") in the HTTP response.
## 2024-07-08 - Prevent DoS via Unbounded Inputs in FastAPI
**Vulnerability:** The `PredictionInput` Pydantic model in `main.py` lacked a `max_length` constraint on the `features` list. This allowed an attacker to submit an excessively large list, potentially causing a Denial of Service (DoS) by exhausting server memory or CPU during validation and processing.
**Learning:** Pydantic models in FastAPI need explicit constraints on iterables (lists, strings, etc.) to prevent unbounded input consumption. Default unconstrained lists can be exploited to crash the server.
**Prevention:** Always use `pydantic.Field` with a `max_length` (or `max_items`) parameter for list inputs to enforce strict size limits.
