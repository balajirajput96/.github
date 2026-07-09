## 2025-02-14 - Replace requests with Session for connection pooling
**Learning:** Using bare `requests.get()` and `requests.post()` repeatedly within a script opens a new TCP connection (and full TLS handshake) for every API request, which adds a lot of latency.
**Action:** Use a shared `requests.Session()` which uses connection pooling natively to improve API latency, especially when communicating with the same host multiple times (like an LLM inference API).
