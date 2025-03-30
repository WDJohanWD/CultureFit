import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression';


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
})
