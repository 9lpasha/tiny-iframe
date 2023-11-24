import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import inject from "rollup-plugin-inject";
import { config } from "dotenv";
import { randomBytes } from "crypto";

config();

function generateRandomString(length) {
  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

export default defineConfig({
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name]-${generateRandomString(8)}[extname]`,
      },
    },
  },
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
