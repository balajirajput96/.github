## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.
## 2024-07-19 - React State Unmount Cleanups for Micro-UX
**Learning:** Adding micro-UX features like temporary "Copied!" states often involves `setTimeout`. If the component unmounts (e.g., navigating away quickly) before the timeout completes, React can throw state warnings or cause memory leaks.
**Action:** Always wrap `setTimeout` for UI state transitions in a `useRef` and clear it using a `useEffect` cleanup function to ensure safe unmounting, even for simple copy buttons.
