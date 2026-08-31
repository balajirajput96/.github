## 2024-08-27 - Terminal Prompt Accessibility and Selection UX
**Learning:** Terminal UI components often use decorative symbols like `~` and `$` to simulate prompts. However, if left unchecked, screen readers announce these redundantly, and users accidentally select them when trying to copy terminal commands.
**Action:** Always add `aria-hidden="true"` to hide decorative prompt symbols from screen readers, and apply `userSelect: 'none'` to prevent accidental highlighting during command copy-pasting.

## 2024-09-12 - Keyboard focus parity on hover effects
**Learning:** Adding hover effects (`whileHover` in Framer Motion or `:hover` in CSS) to cards and containers visually enhances interactions, but leaves keyboard users without equivalent visual feedback.
**Action:** When adding hover states for interactivity/delight to non-interactive container elements, apply `tabIndex={0}` and equivalent focus states (`whileFocus` and `:focus-visible`) to maintain accessibility parity.

## 2024-11-20 - Code snippet selection and keyboard scrolling
**Learning:** Users often triple-click or try to carefully highlight code snippets to copy them, which can be frustrating. Furthermore, `overflow-x: auto` containers used for long code blocks are not focusable by default, meaning keyboard-only users cannot scroll horizontally to read the full command.
**Action:** Use `userSelect: 'all'` on code snippets so a single click selects the entire text. Additionally, always add `tabIndex={0}` and an appropriate `aria-label` to `overflow-x: auto` containers to ensure they are keyboard accessible.
