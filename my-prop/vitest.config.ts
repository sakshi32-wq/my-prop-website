import { defineConfig } from "vitest/config"
import viteReact from "@vitejs/plugin-react"

// Separate from vite.config.ts so tests don't load the Start and MSW plugins.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [viteReact()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // Wizard tests walk many steps with real user events.
    testTimeout: 15_000,
  },
})
