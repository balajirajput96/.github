## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.
## 2024-05-18 - Static Arrays in Render Function Anti-Pattern
**Learning:** Found multiple instances where large static arrays or randomized particle generations were placed directly inside component render functions (`OrbitBackground.tsx`, `TerminalPreview.tsx`, `Features.tsx`, `Quickstart.tsx`). This causes unnecessary reallocation on every re-render and, in the case of `OrbitBackground`, could cause unwanted flickering of randomized values if parent re-renders occurred.
**Action:** Always verify if constant data or one-time randomized values can be hoisted out of the React component module scope to prevent re-creation, reduce GC pressure, and ensure rendering stability.
