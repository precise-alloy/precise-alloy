// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

import { getManualChunk } from './manual-chunk';

describe('xpack/manual-chunk.ts', () => {
  it('returns undefined for external node_modules entries', () => {
    const api = {
      getModuleInfo: vi.fn(),
    };

    expect(getManualChunk('/repo/node_modules/react/index.js', api as never)).toBeUndefined();
  });

  it('returns undefined for non-entry internal modules', () => {
    const api = {
      getModuleInfo: vi.fn().mockReturnValue({ isEntry: false }),
    };

    expect(getManualChunk('src/pages/home.tsx', api as never)).toBeUndefined();
  });

  it('maps entry files under src to the existing chunk naming convention', () => {
    const api = {
      getModuleInfo: vi.fn().mockReturnValue({ isEntry: true }),
    };

    expect(getManualChunk('src/pages/home.tsx', api as never)).toBe('pages~home');
  });

  it('returns undefined when the internal entry path does not match the naming pattern', () => {
    const api = {
      getModuleInfo: vi.fn().mockReturnValue({ isEntry: true }),
    };

    expect(getManualChunk('src/organisms/hero/index.tsx', api as never)).toBeUndefined();
  });

  it('returns undefined for entry modules outside the src root', () => {
    // Entry files that resolve outside of `src/` (e.g. xpack scripts or root
    // configuration entries) must not be rewritten into the internal chunk
    // naming convention.
    const api = {
      getModuleInfo: vi.fn().mockReturnValue({ isEntry: true }),
    };

    expect(getManualChunk('xpack/scripts.ts', api as never)).toBeUndefined();
  });
});
