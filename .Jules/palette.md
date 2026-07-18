## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.

## 2024-07-18 - [UX] Code Block Copy Actions
**Learning:** Displaying setup instructions as static text requires users to manually select and copy them, adding friction to the onboarding process. Adding a dedicated "Copy to clipboard" action with visually accessible feedback ("Copied!") creates a more intuitive and seamless quickstart experience.
**Action:** Always provide explicit copy buttons (with accessible feedback and `aria-live` regions) for instructional code blocks, rather than relying on manual text selection.
