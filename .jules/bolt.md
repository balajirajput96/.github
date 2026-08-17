## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.
## 2024-05-18 - [React Hook Placement in Optimizations]
**Learning:** Placing React hooks (like `useMemo`) directly inline within the JSX return statement, even if they don't immediately crash in a static context, violates React's Rules of Hooks, hurts readability, and makes the code fragile to future refactoring.
**Action:** When memoizing mapped elements or derived state to optimize rendering, always declare the hook (`useMemo`) at the top level of the component function block and assign its result to a variable to be referenced in the JSX.
## 2024-05-14 - Extracted Static JSX in Frequently Rendered Component
**Learning:** In components with frequent state-driven re-renders (like typing animations using `setInterval`), inline static JSX elements are re-created and diffed by React on every frame.
**Action:** Extract large, purely static JSX blocks to constants completely outside the component function. This ensures the React element is created only once, and the reconciler can skip diffing it entirely since the element reference remains stable (`oldElement === newElement`).
## 2024-08-17 - React Static JSX Extraction

**Learning:** When optimizing React components containing rapidly changing state (like a `setInterval` driving a typing animation), `useMemo` is not the only or best tool for static parts. By extracting completely static JSX blocks (like decorative prompts and cursors) into constants *outside* the functional component entirely, the React elements are only created once at module load time. The reconciliation engine can then do an exact reference check and skip diffing them entirely. Also, remember not to wrap these extracted blocks with JSX comments at the top level to avoid TSX compilation issues.
**Action:** Always scan for purely static elements inside frequently re-rendering components and hoist them to module-level constants. Use `useMemo` only when the element actually depends on component props/state but still needs to avoid re-calculation most of the time.
