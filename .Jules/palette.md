## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.

## 2024-07-14 - Playwright Verification with Client-Side Routing
**Learning:** Using `file://` to load the built index.html for Playwright testing fails because TanStack Router requires a proper server for client-side routing to function, otherwise elements like 'text=Defy gravity' won't render.
**Action:** Always start a local server (e.g. `pnpm preview` on port 4173) and test against `http://localhost:4173` when verifying frontend changes in apps using client-side routing.
