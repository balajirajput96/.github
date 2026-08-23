## 2024-08-23 - Terminal Prompt Accessibility
**Learning:** Decorative terminal characters like '~' and '$' should have `userSelect: 'none'` and `aria-hidden='true'` to prevent screen reader noise and accidental copying.
**Action:** Always add these attributes to decorative prompt characters in terminal or code block components.
