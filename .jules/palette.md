## 2024-08-22 - Prevent copying terminal prompt symbols
**Learning:** Terminal components often use symbols like `~` and `$` to simulate command prompts. If these are selectable, users who copy-paste commands will accidentally include these symbols, breaking their scripts. Screen readers also read them out redundantly.
**Action:** Always add `userSelect: "none"` and `aria-hidden="true"` to decorative terminal prompt symbols to ensure smooth copying and a11y.
