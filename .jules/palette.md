## 2024-08-27 - Terminal Prompt Accessibility and Selection UX
**Learning:** Terminal UI components often use decorative symbols like `~` and `$` to simulate prompts. However, if left unchecked, screen readers announce these redundantly, and users accidentally select them when trying to copy terminal commands.
**Action:** Always add `aria-hidden="true"` to hide decorative prompt symbols from screen readers, and apply `userSelect: 'none'` to prevent accidental highlighting during command copy-pasting.

## 2024-09-12 - Keyboard focus parity on hover effects
**Learning:** Adding hover effects (`whileHover` in Framer Motion or `:hover` in CSS) to cards and containers visually enhances interactions, but leaves keyboard users without equivalent visual feedback.
**Action:** When adding hover states for interactivity/delight to non-interactive container elements, apply `tabIndex={0}` and equivalent focus states (`whileFocus` and `:focus-visible`) to maintain accessibility parity.
