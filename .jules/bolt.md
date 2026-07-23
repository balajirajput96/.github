## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.
## 2026-07-23 - [Component Re-renders on Animation Tick]
**Learning:** When using React state for high-frequency animations like typing effects (e.g., updating state every 100ms), any complex UI lists inside the component will be unnecessarily re-evaluated and re-rendered on every tick, causing wasted CPU cycles and dropped frames.
**Action:** Move static array definitions outside of the component and use `useMemo` on the rendered output of static or slowly changing lists to isolate them from high-frequency state updates.
