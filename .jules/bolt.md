## 2025-02-14 - Replace requests with Session for connection pooling
**Learning:** Using bare `requests.get()` and `requests.post()` repeatedly within a script opens a new TCP connection (and full TLS handshake) for every API request, which adds a lot of latency.
**Action:** Use a shared `requests.Session()` which uses connection pooling natively to improve API latency, especially when communicating with the same host multiple times (like an LLM inference API).

## 2025-02-14 - Move state-driven animations to CSS
**Learning:** Using React state and `setInterval`/`useEffect` to drive visual animations like cursor blinking (e.g., in `TerminalPreview.tsx`) causes unnecessary and continuous component re-renders (in this case, 2 re-renders per second, indefinitely).
**Action:** Always prefer CSS `@keyframes` animations for simple, continuous visual effects to offload the work from the main thread and prevent excessive React re-renders.
