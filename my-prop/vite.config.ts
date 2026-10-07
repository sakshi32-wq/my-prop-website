import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { msw } from "msw/vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // recharts imports named exports from react-is (CommonJS), so pre-bundle both
  optimizeDeps: { include: ["react-is", "recharts"] },
  plugins: [
    devtools(),
    // Serves mockServiceWorker.js in dev and emits it into client builds.
    msw({ mode: "worker-only" }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
