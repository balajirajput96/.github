## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.
## 2023-10-27 - Framer Motion Keyboard Accessibility Parity
**Learning:** Interactive elements using Framer Motion's `whileHover` do not automatically provide keyboard focus states (`whileFocus`), breaking interaction parity for keyboard-only users.
**Action:** When adding `whileHover` to an element, always explicitly add a corresponding `whileFocus` (or `onFocus`/`onBlur`) property with matching visual styles to ensure keyboard accessibility.
