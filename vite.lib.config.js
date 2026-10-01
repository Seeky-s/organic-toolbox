import { defineConfig } from 'vite';
export default defineConfig({build:{copyPublicDir:false,lib:{entry:'src/index.js',formats:['es'],fileName:'toolbox'},rollupOptions:{external:['react','react-dom','mouse-reveal-organique']}}});
