import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
    },
    setupFiles: "./setupTests.ts",
  },
});
