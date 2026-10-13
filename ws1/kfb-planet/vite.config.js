import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  publicDir: false,
  build: { assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 100_000 },
})
