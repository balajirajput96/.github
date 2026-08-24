
## 2024-08-24 - Terminal UI Polish
**Learning:** Decorative terminal UI elements (like prompts `~`, `$` and cursors) are often read unnecessarily by screen readers and accidentally selected when users try to copy output, ruining the experience.
**Action:** Always add `aria-hidden="true"` and `userSelect: 'none'` to these decorative terminal elements (as done in `TerminalPreview.tsx` and `InstallCommand.tsx`) to improve both accessibility and text selection UX.
