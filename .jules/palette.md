
## 2024-07-27 - Framer Motion Keyboard Accessibility
**Learning:** In the Vite + TanStack Router frontend, interactive elements using Framer Motion's `whileHover` prop often lack corresponding keyboard focus states by default, leading to an inconsistent experience for keyboard users navigating interactive components like buttons.
**Action:** When using Framer Motion's `whileHover` (or manual `onMouseEnter` events), explicitly add the corresponding focus states (`whileFocus`, `onFocus`) to maintain keyboard interaction parity.
