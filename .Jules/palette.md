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

## 2024-10-25 - [UX] Polymorphic Buttons for Navigation Links
**Learning:** Using an `onClick` handler on a `<button>` element to simulate navigation (e.g., `window.location.href = '...'`) breaks native browser link behaviors (like middle-click to open in a new tab) and degrades SEO and screen reader accessibility because semantic `<button>`s are not identified as links.
**Action:** When a button visually acts as a link, always make the component polymorphic so it can render as an `<a>` tag when an `href` prop is passed. Use TypeScript discriminated unions (e.g., `href?: never` for button vs `href: string` for anchor) to cleanly implement this and enforce correct prop usage without breaking existing `<button>` implementations.
