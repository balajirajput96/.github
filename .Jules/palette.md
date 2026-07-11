## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.

## 2024-05-19 - Screen Reader UX on Icon-only Copy Buttons
**Learning:** Icon-only copy buttons lack clear feedback for screen reader users and missing tooltips can cause hesitation. Additionally, decorative command-line prefixes like "$" can clutter screen reader output ("dollar curl...").
**Action:** Always provide dynamic `aria-label` and native `title` (e.g. switching from "Copy" to "Copied!") for copy-to-clipboard interactions. Use `aria-hidden="true"` on decorative characters like command prompts.
