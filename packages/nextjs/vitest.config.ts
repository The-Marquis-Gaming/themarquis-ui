import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [],
  test: {
    environment: "jsdom",
    include: ["**/*.test.tsx"],
    globals: true,
  },
  resolve: {
    alias: {
      "~~": path.resolve(__dirname, "./"),
    },
  },
});
