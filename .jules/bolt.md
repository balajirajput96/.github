## 2024-07-11 - Static Array Memory Allocation in Framer Motion Animations
**Learning:** Animations using `setInterval` or continuous re-rendering (like the typing effect in `TerminalPreview.tsx` updating every 100ms) will recreate arrays defined inside the component on every frame. When combined with Framer Motion's `<AnimatePresence>`, this can cause unnecessary GC pressure.
**Action:** Always hoist static configuration arrays outside the React component body, especially in components that manage high-frequency internal state updates for animations.
