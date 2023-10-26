import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		svelte({
		  include: ["./src/components/*.svelte"],
		  compilerOptions: {
			customElement: true,
		  },
		  emitCss: false,
		}),
	  ],
	  build: {
		sourcemap: true,
		target: "modules",
		lib: {
		  entry: "./src/components/index.ts",
		  name: "<<name>>",
		  fileName: "components",
		},
	  },
});
