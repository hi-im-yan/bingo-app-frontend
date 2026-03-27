import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
		exclude: ['node_modules', '.next', 'e2e'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'text-summary', 'lcov'],
			include: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'hooks/**/*.{ts,tsx}'],
			exclude: ['**/*.test.*', '**/*.spec.*', '**/*.config.*', '**/*.d.ts'],
			thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
		},
	},
});
