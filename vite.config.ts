// import { defineConfig } from 'vite'
// import path from 'path'
// import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [
//     // The React and Tailwind plugins are both required for Make, even if
//     // Tailwind is not being actively used – do not remove them
//     react(),
//     tailwindcss(),
//   ],
//   resolve: {
//     alias: {
//       // Alias @ to the src directory
//       '@': path.resolve(__dirname, './src'),
//     },
//   },

//   // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
//   assetsInclude: ['**/*.svg', '**/*.csv'],
// })






import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Workaround

    {
      name: 'load+transform-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null;
        }
        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic', // 👈 this is important
        });
      },
    },

    // End workaround
  ],

  // Workaround before renaming .js to .jsx
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
    force:true
  },
  // End workaround

});

