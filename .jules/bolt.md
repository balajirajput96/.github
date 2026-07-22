## 2023-10-27 - [React Render Optimization]
**Learning:** React state-driven animations (like a blinking cursor using `setInterval` and `setState`) cause continuous component re-renders, wasting CPU cycles and potentially dropping frames.
**Action:** Always favor CSS `@keyframes` animations for simple, continuous visual effects like blinking or spinning to offload work to the browser's compositor thread and eliminate unnecessary React re-renders.
## 2024-05-30 - Reducing React Re-rendering via Component Extraction
**Learning:** In React components featuring fast intervals (e.g. 100ms for typewriter effects), putting the interval state in the parent component forces large sub-trees to reconcile continuously.
**Action:** Always decouple rapid transient state into tiny leaf components. Also ensure that dependency arrays are stable (e.g., using useCallback for parent-passed callbacks) to prevent child  from restarting unintentionally.
## 2024-05-30 - Reducing React Re-rendering via Component Extraction
**Learning:** In React components featuring fast intervals (e.g. 100ms for typewriter effects), putting the interval state in the parent component forces large sub-trees to reconcile continuously.
**Action:** Always decouple rapid transient state into tiny leaf components. Also ensure that dependency arrays are stable (e.g., using useCallback for parent-passed callbacks) to prevent child effects from restarting unintentionally.
