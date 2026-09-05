## 2024-08-27 - Terminal Prompt Accessibility and Selection UX
**Learning:** Terminal UI components often use decorative symbols like `~` and `$` to simulate prompts. However, if left unchecked, screen readers announce these redundantly, and users accidentally select them when trying to copy terminal commands.
**Action:** Always add `aria-hidden="true"` to hide decorative prompt symbols from screen readers, and apply `userSelect: 'none'` to prevent accidental highlighting during command copy-pasting.

## 2024-09-12 - Keyboard focus parity on hover effects
**Learning:** Adding hover effects (`whileHover` in Framer Motion or `:hover` in CSS) to cards and containers visually enhances interactions, but leaves keyboard users without equivalent visual feedback.
**Action:** When adding hover states for interactivity/delight to non-interactive container elements, apply `tabIndex={0}` and equivalent focus states (`whileFocus` and `:focus-visible`) to maintain accessibility parity.

## 2024-11-20 - Framer Motion CSS Transition Conflict
**Learning:** Applying a generic `transition: 'all ...'` via inline styles or CSS classes to a `<motion.element>` component intercepts Framer Motion's internal JavaScript-driven animation values. For example, if Framer Motion tries to smoothly animate a `transform` (like `scale` or `y`) on `whileHover`, the CSS `transition: all` forces the browser to apply its own timing function over the JS animation, causing severe visual jank and stuttering.
**Action:** When styling a `motion` component that uses interaction properties (`whileHover`, `whileTap`, `whileFocus`), never use `transition: all`. Explicitly specify which CSS properties should be transitioned (e.g., `transition: background-color 0.2s, color 0.2s`), explicitly omitting `transform` or `opacity` if Framer Motion controls them.

## 2024-11-20 - Code snippet selection and keyboard scrolling
**Learning:** Users often triple-click or try to carefully highlight code snippets to copy them, which can be frustrating. Furthermore, `overflow-x: auto` containers used for long code blocks are not focusable by default, meaning keyboard-only users cannot scroll horizontally to read the full command.
**Action:** Use `userSelect: 'all'` on code snippets so a single click selects the entire text. Additionally, always add `tabIndex={0}` and an appropriate `aria-label` to `overflow-x: auto` containers to ensure they are keyboard accessible.

## 2024-11-20 - Synchronizing keyboard focus with in-page scroll targets
**Learning:** When implementing in-page navigation (like "Skip to main content" links or "Scroll to section" buttons using `scrollIntoView`), visually scrolling the page does not automatically move the browser's active keyboard focus to the new section. If focus is left behind, keyboard users (and screen readers) will resume navigation from the original button, effectively ignoring the visual scroll.
**Action:** When scrolling to an element via JS or anchor links, ensure the target container (e.g., `<main>`, `<section>`) has `tabIndex={-1}` and `style={{ outline: 'none' }}`. Then, programmatically call `.focus({ preventScroll: true })` on the target element immediately after scrolling.

## 2024-11-20 - [Make Call-to-Action Buttons Polymorphic]
**Learning:** React UI components (like `Button`) that function as navigation links (e.g. in `DocsCTA.tsx`) were using `onClick` with `window.location.href`, causing them to be read as buttons rather than links by screen readers and breaking standard link features.
**Action:** Made the `Button` component polymorphic to dynamically render an anchor (`<a>`) tag when an `href` prop is provided. Update navigation CTAs to use the `href` prop instead of `onClick` to preserve semantic HTML, correct screen reader announcements, and native browser behaviors like 'Open in New Tab'.
