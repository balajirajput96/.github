## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.

## 2025-02-23 - [Static Object Allocations in Render Loops]
**Learning:** Hardcoding static arrays or objects directly inside React component bodies causes them to be re-allocated on every single render. In components that re-render frequently (like `TerminalPreview.tsx` which updates state every 100ms for a typing effect), this leads to continuous, unnecessary garbage collection and can even cause visual glitches if the objects contain randomly generated data (`OrbitBackground.tsx` generating new random particles).
**Action:** Extract all static arrays, constant objects, and one-time randomly generated non-state data outside the React component body so they are instantiated only once when the module loads, ensuring referential stability and reducing GC overhead.
