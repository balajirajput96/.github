## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.

## 2024-07-23 - [UX] Keyboard Parity for Framer Motion Hover States
**Learning:** When using Framer Motion's `whileHover` for interactive elements (like scaling or color changes on buttons), keyboard users miss out on this visual feedback during navigation unless `whileFocus` is explicitly defined.
**Action:** Always pair `whileHover` with an identical `whileFocus` property on interactive `motion` elements to ensure equitable visual feedback for keyboard navigation.
