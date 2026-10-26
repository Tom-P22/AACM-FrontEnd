import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(viteConfig, defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "servicios",
          environment: "node",
          include: ["tests/*.test.js"],
        },
      },
      {
        test: {
          name: "componentes",
          environment: "jsdom",
          setupFiles: ["./tests/setup.js"],
          include: ["tests/components/**/*.spec.jsx"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx}"],
      reporter: ["text", "html", "lcov", "json-summary"],
    },
  },
}));
