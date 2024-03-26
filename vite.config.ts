import { defineConfig } from "vite";
import { resolve } from "path";
import copy from "rollup-plugin-copy";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  build: {
    target: "node16", // Node.js version
    assetsDir: "ds",

    minify: false,
    emptyOutDir: false,
    sourcemap: true,
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      external: ["vscode", "commonjs"],
    },

    lib: {
      entry: resolve(__dirname, "src/extension.ts"),
      name: "pnpm-power-menu", // Replace with your extension's name
      formats: ["cjs"], // CommonJS format for VS Code extensions
      fileName: "extension",
    },
  },
  root: "src",
  plugins: [
    nodeResolve({
      // Configure the resolver
      preferBuiltins: true, // Prefer Node.js built-in modules over npm modules with the same name
    }),
    commonjs(), // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    copy({
      targets: [{ src: "src/assets", dest: "dist" }],
      verbose: true,
    }),
  ],
});
