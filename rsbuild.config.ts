import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  // source: {
  //   // Enable dynamic imports for model files
  //   dynamicImportMode: 'eager', // or 'lazy'
  // },
  tools: {
    rspack(config, { addRules }) {
      addRules([
        {
          test: /\.(fbx|gltf|glb)$/,
          type: 'asset/resource', // Treats files as separate assets
        },
        {
          test: /\.(mp3|wav)$/,
          type: 'asset/resource', // Treats files as separate assets
        },
        // {
        //   test: /\.css$/,
        //   use: ['postcss-loader'],
        //   type: 'css',
        // },
      ]);
    },
  },
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift([
          'babel-plugin-react-compiler',
          {
            // Optional configuration
            target: '18', // Can be '17', '18', or '19'
          },
        ]);
      },
    }),
  ],
});
