import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Keep legacy tests that use jest.fn() working while the runner is migrated to Vitest.
globalThis.jest = vi;
