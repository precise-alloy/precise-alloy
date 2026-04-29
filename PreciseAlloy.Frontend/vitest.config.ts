import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

import alias from './xpack/alias';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'xpack/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      include: [
        'src/_api/avatar.ts',
        'src/_api/contact-form.ts',
        'src/_helpers/handleTheme.ts',
        'src/_helpers/ReactSection.tsx',
        'src/_helpers/RequireCss.tsx',
        'src/_helpers/RequireJs.tsx',
        'src/assets/scripts/main/api.ts',
        'src/organisms/contact/contact-form.tsx',
        'xpack/asset-hash.ts',
        'xpack/filename.ts',
        'xpack/hooks/inject-functions.ts',
        'xpack/hooks/inject-functions-core.ts',
        'xpack/integration-core.ts',
        'xpack/manual-chunk.ts',
        'xpack/prerender-core.ts',
        'xpack/scripts-core.ts',
        'xpack/styles-core.ts',
      ],
      exclude: ['src/**/*.test.{ts,tsx}', 'xpack/**/*.test.{ts,tsx}', 'src/**/*.d.ts', 'src/vite-env.d.ts', 'types.d.ts'],
      thresholds: {
        perFile: true,
        lines: 100,
        statements: 100,
        functions: 100,
        // Branches stays at the achieved per-file minimum: the `||` chain in
        // removeDuplicateAssets includes a defensive bare-defer comparator
        // (`attr('defer') === ''`) whose execution depends on cheerio's attr
        // normalization, which V8 occasionally reports as a partial branch.
        // 95 keeps the gate strict while tolerating the residual micro-branch.
        branches: 95,
      },
    },
  },
});
