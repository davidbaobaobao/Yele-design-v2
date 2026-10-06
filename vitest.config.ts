import { defineConfig } from 'vitest/config'

// Unit tests only (no DOM / no Next runtime). Scoped to lib/**/*.test.ts so it
// never tries to run the app itself.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
})
