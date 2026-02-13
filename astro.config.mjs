// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    {
      name: "startup-log",
      hooks: {
        "astro:server:start": () => {
          console.log();
          console.log(
            "  \x1b[44m\x1b[37m Boilerplate \x1b[0m \x1b[1mAstro + React Admin\x1b[0m",
          );
          console.log("  \x1b[1mReady to build something awesome!\x1b[0m");
          console.log();
        },
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      force: true,
    },
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        "@lib": "/src/lib",
        "@react": "/src/react",
        "@features": "/src/react/features",
        "@pages": "/src/react/pages",
        "@assets": "/src/assets",
      },
    },
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
          defaultHandler(warning);
        },
      },
    },
    server: {
      watch: {
        usePolling: true,
        interval: 500,
      },
    },
  },
});
