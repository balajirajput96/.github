## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.
## 2024-05-18 - [React Hook Placement in Optimizations]
**Learning:** Placing React hooks (like `useMemo`) directly inline within the JSX return statement, even if they don't immediately crash in a static context, violates React's Rules of Hooks, hurts readability, and makes the code fragile to future refactoring.
**Action:** When memoizing mapped elements or derived state to optimize rendering, always declare the hook (`useMemo`) at the top level of the component function block and assign its result to a variable to be referenced in the JSX.
## 2024-05-14 - Extracted Static JSX in Frequently Rendered Component
**Learning:** In components with frequent state-driven re-renders (like typing animations using `setInterval`), inline static JSX elements are re-created and diffed by React on every frame.
**Action:** Extract large, purely static JSX blocks to constants completely outside the component function. This ensures the React element is created only once, and the reconciler can skip diffing it entirely since the element reference remains stable (`oldElement === newElement`).

## 2025-02-14 - Replace requests with Session for connection pooling
**Learning:** Using bare `requests.get()` and `requests.post()` repeatedly within a script opens a new TCP connection (and full TLS handshake) for every API request, which adds a lot of latency.
**Action:** Use a shared `requests.Session()` which uses connection pooling natively to improve API latency, especially when communicating with the same host multiple times (like an LLM inference API).

## 2025-02-14 - Move state-driven animations to CSS
**Learning:** Using React state and `setInterval`/`useEffect` to drive visual animations like cursor blinking (e.g., in `TerminalPreview.tsx`) causes unnecessary and continuous component re-renders (in this case, 2 re-renders per second, indefinitely).
**Action:** Always prefer CSS `@keyframes` animations for simple, continuous visual effects to offload work from the main thread and prevent excessive React re-renders.

## 2024-05-14 - React Animation State Updates Causing Unnecessary Re-renders
**Learning:** High-frequency state updates (like typing animations using `setInterval` every 100ms) will trigger a full component re-render. If the component also renders a mapped list (like previous terminal lines), these elements will be needlessly recreated and reconciled on every frame of the animation, causing unnecessary CPU overhead and potential jank, even if they don't change.
**Action:** Extract constant data arrays outside the component scope to avoid reallocation, and use `useMemo` to memoize the rendering of list elements that depend on a slow-changing state (e.g. `currentLine`) so they are isolated from the fast-changing state (e.g. `text` for the typing animation).

## 2024-08-17 - React Static JSX Extraction
**Learning:** When optimizing React components containing rapidly changing state (like a `setInterval` driving a typing animation), `useMemo` is not the only or best tool for static parts. By extracting completely static JSX blocks (like decorative prompts and cursors) into constants outside the functional component entirely, the React elements are only created once at module load time. The reconciler can then do an exact reference check and skip diffing it entirely since the element reference remains stable (`oldElement === newElement`). Also, remember not to wrap these extracted blocks with JSX comments at the top level to avoid TypeScript/TSX compilation issues.
**Action:** Always scan for purely static elements inside frequently re-rendering components and hoist them to module-level constants. Use `useMemo` only when the element actually depends on component props/state but still needs to avoid re-calculation most of the time.
