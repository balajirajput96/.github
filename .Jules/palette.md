## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.
## 2024-11-20 - Adding focus states inline to match hover states
**Learning:** This codebase heavily relies on inline event handlers for styling changes (like `onMouseEnter`/`onMouseLeave` changing text color strings) rather than CSS classes or standard CSS `:hover`/`:focus` pseudo-classes. When adding focus support, strictly mirroring these existing inline patterns (with `onFocus`/`onBlur`) is necessary to adhere to the rule against adding custom CSS.
**Action:** When improving keyboard accessibility or interactive states in this project, inspect how the hover states are implemented. Replicate the same mechanism (Framer Motion props or inline React event handlers) for focus states instead of trying to introduce standard CSS solutions.
