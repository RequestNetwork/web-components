import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $src: "./src",
      $utils: "./src/lib/utils",
    },
  },
  compilerOptions: {
    customElement: true,
  },
};

export default config;
