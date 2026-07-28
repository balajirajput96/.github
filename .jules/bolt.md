## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.
## 2024-05-18 - [React Hook Placement in Optimizations]
**Learning:** Placing React hooks (like `useMemo`) directly inline within the JSX return statement, even if they don't immediately crash in a static context, violates React's Rules of Hooks, hurts readability, and makes the code fragile to future refactoring.
**Action:** When memoizing mapped elements or derived state to optimize rendering, always declare the hook (`useMemo`) at the top level of the component function block and assign its result to a variable to be referenced in the JSX.
