/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // @ts-ignore
  plugins: [react()],
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
