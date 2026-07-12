## 2024-05-18 - [UX] Sidebar Active State and Nav Landmark
**Learning:** Adding the selected state to the Material-UI List item provides instant visibility of system status, and defining the List as a `nav` component greatly increases accessibility for screen readers.
**Action:** Always verify if a primary sidebar list acts as main navigation, and provide `useLocation` to determine the active route.

## 2023-10-27 - ARIA Controls on Framer Motion Components
**Learning:** Expanding/collapsible regions managed by Framer Motion's `<AnimatePresence>` and `<motion.div>` don't natively map their relationships to toggle buttons for screen readers. In this codebase's FAQ section, toggles were missing `aria-controls` explicitly linking the toggle button to the target content container.
**Action:** Always add explicit `id` to the `<motion.div>` target and matching `aria-controls={id}` to the corresponding toggle `<button>` when building or maintaining animated collapsible regions, especially since animation libraries don't enforce these semantic links.

## 2024-11-20 - Icon-only Copy Buttons and Feedback
**Learning:** Icon-only copy buttons need dual feedback mechanisms to be accessible: a native `title` attribute for sighted users (e.g., "Copy to clipboard" changing to "Copied!") and an `aria-live` region for screen readers. Simply updating the visual state of the button doesn't provide auditory confirmation of a successful action.
**Action:** Always add a visually hidden `div` with `aria-live="polite"` that renders a success message when the copy state is true, in addition to native `title` tooltips.
