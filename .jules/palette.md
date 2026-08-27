## 2024-08-27 - Terminal Prompt Accessibility and Selection UX
**Learning:** Terminal UI components often use decorative symbols like `~` and `$` to simulate prompts. However, if left unchecked, screen readers announce these redundantly, and users accidentally select them when trying to copy terminal commands.
**Action:** Always add `aria-hidden="true"` to hide decorative prompt symbols from screen readers, and apply `userSelect: 'none'` to prevent accidental highlighting during command copy-pasting.
