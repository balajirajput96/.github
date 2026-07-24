## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.

## 2026-07-24 - [Expensive React Initializations]
**Learning:** Wrapping a component in `React.memo()` prevents unnecessary layout recalculations and animation glitches if parent components trigger re-renders. Furthermore, for computationally heavy inline initializations (like `Math.random()` in loops for particles), always use `useMemo` to evaluate the logic only once on mount, rather than on every render cycle.
**Action:** Use `useMemo` to prevent expensive inline initializations inside functional components, and use `React.memo()` on pure presentational components to skip render propagation.
