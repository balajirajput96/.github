## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.

## 2024-08-14 - [UX] Decorative SVGs inside Interactive Elements
**Learning:** Decorative icons (like SVG elements) inside interactive elements (buttons, toggles) or components with accompanying text will be redundantly announced by screen readers (e.g. as "graphic") if not explicitly hidden, creating unnecessary noise for visually impaired users.
**Action:** Always add `aria-hidden="true"` to decorative SVGs when they are placed next to visible label text or title attributes to ensure a cleaner screen reader experience.
