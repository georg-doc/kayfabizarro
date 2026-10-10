import { defineConfig, type Plugin } from 'vite';

/** three-inspect 0.7.2 bundles an old troika Text whose customDepthMaterial / customDistanceMaterial are getter-only;
 *  three r186's Object3D constructor assigns them → TypeError. Add no-op setters at load time (node_modules untouched). */
function patchThreeInspect(): Plugin {
  return {
    name: 'patch-three-inspect-troika',
    transform(code, id) {
      if (!id.includes('three-inspect/dist/inspector.js')) return null;
      return code
        .replace('get customDepthMaterial() {', 'set customDepthMaterial(e) {}\n  get customDepthMaterial() {')
        .replace('get customDistanceMaterial() {', 'set customDistanceMaterial(e) {}\n  get customDistanceMaterial() {');
    },
  };
}

export default defineConfig({
  plugins: [patchThreeInspect()],
  optimizeDeps: { exclude: ['three-inspect'] },
  server: {
    // No HMR / auto-reload: many agents edit files while others screenshot; a reload mid-run destroys their page.
    // New page loads always get the latest code. Reload the browser manually after edits.
    hmr: false,
    watch: { ignored: ['**/docs/**', '**/tools/out/**'] },
  },
  build: { target: 'es2022', chunkSizeWarningLimit: 4000 },
});
