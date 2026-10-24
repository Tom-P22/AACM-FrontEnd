import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    include: ["tests/**/*.spec.jsx"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx}"],
      reporter: ["text", "html", "lcov", "json-summary"],
    },
  },
}));
