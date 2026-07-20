## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.
## 2025-02-20 - [Vite ESLint Build Context]
**Learning:** The root Vite frontend currently fails `pnpm lint` due to a missing ESLint configuration file (`eslint.config.js`).
**Action:** Use `npx tsc --noEmit` and `pnpm build` to verify changes instead of `pnpm lint` in this specific frontend context until the ESLint config is established.
