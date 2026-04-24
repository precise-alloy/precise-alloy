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
        'src/_helpers/css-vip.ts',
        'src/_helpers/handleTheme.ts',
        'src/_helpers/ReactSection.tsx',
        'src/_helpers/RequireCss.tsx',
        'src/_helpers/RequireJs.tsx',
        'src/assets/scripts/main/api.ts',
        'src/assets/scripts/main/functions.ts',
        'src/organisms/contact/contact-form.tsx',
        'xpack/filename.ts',
        'xpack/hooks/handle-hot-update.ts',
        'xpack/hooks/options-core.ts',
        'xpack/hooks/transform-core.ts',
        'xpack/hooks/transform-index-html.ts',
        'xpack/integration-core.ts',
        'xpack/manual-chunk.ts',
        'xpack/paths.ts',
        'xpack/prerender-core.ts',
        'xpack/root/root-context.ts',
        'xpack/root/use-click-outside.ts',
        'xpack/scripts-core.ts',
        'xpack/styles-core.ts',
      ],
      exclude: ['src/**/*.test.{ts,tsx}', 'xpack/**/*.test.{ts,tsx}', 'src/**/*.d.ts', 'src/vite-env.d.ts', 'types.d.ts'],
      thresholds: {
        perFile: true,
        lines: 90,
        statements: 90,
        functions: 90,
        branches: 80,
      },
    },
  },
});
