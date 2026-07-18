## 2024-07-08 - Prevent Information Leakage in API Error Responses
**Vulnerability:** Fastapi's `HTTPException` was returning the raw exception string `str(e)` on a 500 error, exposing potentially sensitive internal server details or stack traces to the end user.
**Learning:** This is a common pattern when developers quickly add a try-catch block but forget that error details returned to the client can leak sensitive architecture information, path structures, or database details.
**Prevention:** Always log the verbose error details internally (e.g., using `logger.error`), but return a generic, non-descriptive error message (e.g., "An internal error occurred") in the HTTP response.
## 2024-05-15 - Unbounded Array Size DoS Vulnerability
**Vulnerability:** The FastAPI `/predict` endpoint accepted a JSON payload with an unbounded array of floats. A malicious actor could send an array with millions of elements, causing high memory and CPU usage during parsing by Pydantic and conversion to a NumPy array, leading to a Denial of Service (DoS) via memory exhaustion.
**Learning:** Pydantic `List` types without size constraints are dangerous when exposed to public endpoints, especially when the arrays are subsequently processed by memory-intensive libraries like NumPy. This is a common pattern in ML-focused APIs.
**Prevention:** Always use Pydantic's `Field` with `max_length` (e.g., `features: List[float] = Field(..., max_length=10000)`) to enforce upper bounds on list inputs.
