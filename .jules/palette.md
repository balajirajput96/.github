## 2024-08-27 - Terminal Prompt Accessibility and Selection UX
**Learning:** Terminal UI components often use decorative symbols like `~` and `$` to simulate prompts. However, if left unchecked, screen readers announce these redundantly, and users accidentally select them when trying to copy terminal commands.
**Action:** Always add `aria-hidden="true"` to hide decorative prompt symbols from screen readers, and apply `userSelect: 'none'` to prevent accidental highlighting during command copy-pasting.

## 2024-09-12 - Keyboard focus parity on hover effects
**Learning:** Adding hover effects (`whileHover` in Framer Motion or `:hover` in CSS) to cards and containers visually enhances interactions, but leaves keyboard users without equivalent visual feedback.
**Action:** When adding hover states for interactivity/delight to non-interactive container elements, apply `tabIndex={0}` and equivalent focus states (`whileFocus` and `:focus-visible`) to maintain accessibility parity.

## 2024-11-20 - Framer Motion CSS Transition Conflict
**Learning:** Applying a generic `transition: 'all ...'` via inline styles or CSS classes to a `<motion.element>` component intercepts Framer Motion's internal JavaScript-driven animation values. For example, if Framer Motion tries to smoothly animate a `transform` (like `scale` or `y`) on `whileHover`, the CSS `transition: all` forces the browser to apply its own timing function over the JS animation, causing severe visual jank and stuttering.
**Action:** When styling a `motion` component that uses interaction properties (`whileHover`, `whileTap`, `whileFocus`), never use `transition: all`. Explicitly specify which CSS properties should be transitioned (e.g., `transition: background-color 0.2s, color 0.2s`), explicitly omitting `transform` or `opacity` if Framer Motion controls them.
