import { defineConfig } from "vite";
import inject from "@rollup/plugin-inject";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    nodePolyfills(),
    svelte({
      include: ["./src/lib/*.svelte"],
      compilerOptions: {
        customElement: true,
      },
      emitCss: false,
    }),
  ],
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      assert: "assert",
      zlib: "browserify-zlib",
    },
  },
  build: {
    emptyOutDir: false,
    sourcemap: true,
    target: "modules",
    lib: {
      entry: "./src/lib/index.ts",
      name: "<<name>>",
      fileName: "web-component",
    },
    rollupOptions: {
      external: ["@web3-onboard/*"],
      plugins: [
        nodePolyfills({ include: ["crypto", "http"] }),
        inject({ Buffer: ["Buffer", "Buffer"] }),
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    exclude: ["@ethersproject/hash", "wrtc", "http"],
    include: [
      "@web3-onboard/core",
      "@web3-onboard/gas",
      "@web3-onboard/sequence",
      "js-sha3",
      "@ethersproject/bignumber",
    ],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  define: {
    global: "window",
  },
});
