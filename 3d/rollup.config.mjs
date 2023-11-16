import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { readFileSync } from "fs";

export default createConfig({
  pkg: JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")),
  umdName: "G2.Extension3D",
  external: ["@antv/g", "@antv/g-plugin-3d", "@antv/g2"],
  globals: {
    "@antv/g": "window.G",
    "@antv/g-plugin-3d": "window.G.3D",
    "@antv/g2": "window.G2",
  },
});

function createConfig({ pkg, external = [], umdName = "", globals = {}, plugins = [] }) {
  const sharedPlugins = [
    ...plugins,
    nodeResolve({
      mainFields: ["module", "browser", "main"],
      extensions: [".js", ".jsx", ".ts", ".tsx", ".es6", ".es", ".mjs"],
    }),
    commonjs(),
    typescript({ sourceMap: true }),
  ];

  return [
    {
      input: "src/index.ts",
      output: {
        format: "umd",
        file: pkg.unpkg,
        name: umdName,
        globals,
        sourcemap: true,
      },
      external,
      plugins: [
        ...sharedPlugins,
        terser({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
          },
        }),
      ],
    },
  ];
}
