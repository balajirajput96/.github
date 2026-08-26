
## 2024-08-26 - [UX] Decorative Prompt Symbols in Terminal UIs
**Learning:** Terminal UI components often include decorative prompt symbols (like `~` and `$`) and blinking cursors. If these are not hidden from screen readers using `aria-hidden="true"`, they create redundant noise. Furthermore, users often try to copy the commands from these terminal previews; if prompt symbols are selectable, they get accidentally copied along with the command text, leading to invalid commands when pasted into a real terminal.
**Action:** Always add `aria-hidden="true"` and `userSelect: 'none'` (or `user-select: none` in CSS) to decorative terminal prompt symbols to ensure they are ignored by screen readers and not accidentally copied by users. Add `aria-hidden="true"` to decorative cursor elements.
