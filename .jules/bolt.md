## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.
## 2024-05-15 - Unmemoized Random Particle Generation Causes Layout Thrashing
**Learning:** Generating random values and objects inline within a React component like `OrbitBackground.tsx` (e.g. `Array.from({ length: 30 }).map(...)`) causes fresh arrays and values to be recreated on every render. If not memoized, this acts as a ticking time bomb, leading to layout thrashing and causing Framer Motion to lose animation states or restart animations unexpectedly upon parent re-renders.
**Action:** Always wrap randomly generated static configurations (like particle positions or sizes for an animation background) in `useMemo` so that they stay stable across re-renders.
