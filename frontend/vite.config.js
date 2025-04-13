import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
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
    )
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
