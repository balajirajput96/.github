## 2024-07-08 - Prevent Information Leakage in API Error Responses
**Vulnerability:** Fastapi's `HTTPException` was returning the raw exception string `str(e)` on a 500 error, exposing potentially sensitive internal server details or stack traces to the end user.
**Learning:** This is a common pattern when developers quickly add a try-catch block but forget that error details returned to the client can leak sensitive architecture information, path structures, or database details.
**Prevention:** Always log the verbose error details internally (e.g., using `logger.error`), but return a generic, non-descriptive error message (e.g., "An internal error occurred") in the HTTP response.

## 2024-05-24 - [Unbounded List Input DoS]
**Vulnerability:** The FastAPI `main.py` had an endpoint accepting a `List[float]` without any length restriction. An attacker could send an extremely large payload containing millions of items.
**Learning:** Pydantic's `List` type doesn't limit size by default. Converting such a huge list into a NumPy array consumes a massive amount of memory and CPU, which can lead to a Denial of Service (DoS) attack, especially as these computations block the event loop or worker processes.
**Prevention:** Always use `pydantic.Field(max_length=...)` for lists, strings, and other iterables in public endpoints to prevent resource exhaustion attacks.
