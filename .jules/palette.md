## 2024-05-24 - Accessibility for Terminal Mocks
**Learning:** Terminal preview components and mockups often use non-semantic text symbols like `~`, `$`, and `—` for decorative shell prompts and window chrome, which create redundant or confusing screen reader announcements.
**Action:** When implementing terminal mockups, ensure purely decorative text elements and symbols are explicitly hidden using `aria-hidden="true"`, and apply `user-select: none` to prevent them from being copied alongside commands.
