import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import inject from "rollup-plugin-inject";
import { config } from "dotenv";

config();

export default defineConfig({
  build: { outDir: "build" },
  plugins: [
    react(),
    inject({
      include: ["src/**/*.js", "src/**/*.jsx"],
    }),
  ],
  esbuild: {
    loader: "jsx",
    include: /.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  base: "/",
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@import "/src/theme/colors.less";',
      },
    },
  },
});
