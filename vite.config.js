import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inject from 'rollup-plugin-inject';
import { config } from 'dotenv';

config();

const { TINYMCE_URL } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  build: { outDir: 'build', },
  plugins: [
    react(),
    inject({
      include: ['src/**/*.js', 'src/**/*.jsx'],
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  base: '/', // TINYMCE_URL === 'https://support.happydesk.ru/tinymce' ? '/tinymce' : '/test-tinymce',
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@import "/src/theme/colors.less";',
      },
    },
  },
});
