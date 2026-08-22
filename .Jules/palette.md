## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.

## 2024-08-14 - [UX] Decorative SVGs inside Interactive Elements
**Learning:** Decorative icons (like SVG elements) inside interactive elements (buttons, toggles) or components with accompanying text will be redundantly announced by screen readers (e.g. as "graphic") if not explicitly hidden, creating unnecessary noise for visually impaired users.
**Action:** Always add `aria-hidden="true"` to decorative SVGs when they are placed next to visible label text or title attributes to ensure a cleaner screen reader experience.

## 2024-07-14 - Playwright Verification with Client-Side Routing
**Learning:** Using `file://` to load the built index.html for Playwright testing fails because TanStack Router requires a proper server for client-side routing to function, otherwise elements like 'text=Defy gravity' won't render.
**Action:** Always start a local server (e.g. `pnpm preview` on port 4173) and test against `http://localhost:4173` when verifying frontend changes in apps using client-side routing.

## 2024-05-14 - Redundant screen reader announcements in mock terminals
**Learning:** Purely decorative text characters used to simulate terminal UI elements (like `~` and `$` command prompts, or fake blinking cursors) are read aloud by screen readers, creating noisy and frustrating user experiences ("tilde dollar sign ag init").
**Action:** Always add `aria-hidden="true"` to spans containing decorative terminal symbols or cursors that do not convey functional information, prioritizing the actual command text instead.
