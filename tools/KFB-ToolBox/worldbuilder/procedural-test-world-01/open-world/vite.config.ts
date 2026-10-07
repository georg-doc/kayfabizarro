import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    // No HMR / auto-reload: many agents edit files while others screenshot; a reload mid-run destroys their page.
    // New page loads always get the latest code. Reload the browser manually after edits.
    hmr: false,
    watch: { ignored: ['**/docs/**', '**/tools/out/**'] },
  },
  build: { target: 'es2022', chunkSizeWarningLimit: 4000 },
});
