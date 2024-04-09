import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    nodePolyfills(),
    sveltekit(),
    svelte({
      include: ["./src/lib/*.svelte"],
      compilerOptions: {
        customElement: true,
      },
      emitCss: false,
    }),
  ],
  build: {
    emptyOutDir: false,
    sourcemap: true,
    target: "modules",
    lib: {
      entry: "./src/lib/index.ts",
      name: "<<name>>",
      fileName: "web-component",
    },
  },
});
