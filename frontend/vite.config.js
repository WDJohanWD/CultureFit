import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression';
import { visualizer }from 'rollup-plugin-visualizer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173, // o cámbialo si prefieres otro
    host: true, // ← esto es lo que te está faltando
  },
  plugins: [
    ["babel-plugin-transform-imports", {
      "react-icons": {
        "transform": "react-icons/io5/${member}",
        "preventFullImport": true
      }
    }],
    react(),
    tailwindcss(),
    compression(
      {
        algorithm: 'gzip',
        threshold: 1024, 
      }
    ),
    visualizer({
      open: true,
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
