## 2025-02-14 - Replace requests with Session for connection pooling
**Learning:** Using bare `requests.get()` and `requests.post()` repeatedly within a script opens a new TCP connection (and full TLS handshake) for every API request, which adds a lot of latency.
**Action:** Use a shared `requests.Session()` which uses connection pooling natively to improve API latency, especially when communicating with the same host multiple times (like an LLM inference API).

## 2024-07-14 - Toggling state with setInterval for animations causes continuous React re-renders
**Learning:** Using `setInterval` combined with `useState` (e.g., toggling a boolean every 500ms for a blinking cursor) forces React to re-render the entire component continuously, even when the user is idle. This is a common anti-pattern for simple visual effects.
**Action:** Always use CSS keyframes or libraries like Framer Motion (`<motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity }} />`) to offload these continuous animations to the browser's compositor thread, completely bypassing the React render cycle.
