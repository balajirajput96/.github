## 2024-07-07 - [React Router Code Splitting Optimization]
**Learning:** Using `React.lazy` and `Suspense` for routes splits code and reduces initial bundle size. However, tests that load lazy components asynchronously may require `findByRole` instead of `getByRole` since it needs to wait for the chunk to load.
**Action:** When adding React.lazy to routes, ensure test suites use asynchronous matchers like `findBy*` or `waitFor` to accommodate chunk loading.
