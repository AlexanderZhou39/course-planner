import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		splitVendorChunkPlugin(),
		legacy({
			targets: ['defaults', 'not IE 11']
		})
	],
	server: {
		port: 3000
	},
	preview: {
		port: 3000
	},
	css: {
		modules: {
			localsConvention: 'camelCase'
		}
	}
});
