
## 2024-05-18 - Hide Decorative Terminal Elements
**Learning:** Terminal-style UI components often include purely decorative characters like `~` and `$` as part of the prompt line, as well as decorative blinking cursors. If these are not explicitly hidden from screen readers, they result in redundant and confusing voiceover announcements (e.g., "tilde dollar sign ag init").
**Action:** Always explicitly add `aria-hidden="true"` to purely decorative text symbols (like terminal prompts) and decorative elements (like custom text cursors) that provide no semantic value to screen reader users.
