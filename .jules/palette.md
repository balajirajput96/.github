## 2024-07-21 - Screen Reader Spam from Typing Animations
**Learning:** Animated text revealing itself character-by-character (like a terminal typing effect) causes screen readers to constantly announce DOM updates, creating a confusing and spammy experience for users.
**Action:** When building decorative typing animations, hide the animated element from screen readers using `aria-hidden="true"`, and provide a static, visually hidden (`.sr-only`) equivalent of the final content that screen readers can parse at their own pace.
