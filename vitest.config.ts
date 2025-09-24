import { defineConfig } from "vitest/config";

export default defineConfig({
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
