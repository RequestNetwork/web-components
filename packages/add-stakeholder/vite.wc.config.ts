import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
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
			entry: "./src/lib/index.js",
			name: "<<name>>",
			fileName: "web-component"
		}
	}
})
