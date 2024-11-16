import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  tools: {
    rspack(config, { addRules }) {
      addRules([
        {
          test: /\.(fbx|gltf|glb)$/,
          type: 'asset/resource', // Treats files as separate assets
        },
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
