import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const development = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		vite: {
			plugins: [
				// ↓ Needed for development mode
				development &&
					nodePolyfills({
						include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
						http: true,
						crypto: true
					})
			],
			resolve: {
				alias: {
					crypto: 'crypto-browserify',
					stream: 'stream-browserify',
					assert: 'assert'
				}
			},
			build: {
				rollupOptions: {
					plugins: [
						// ↓ Needed for build
						nodePolyfills({ crypto: true, http: true })
					]
				},
				// ↓ Needed for build if using WalletConnect and other providers
				commonjsOptions: {
					transformMixedEsModules: true
				}
			},
			optimizeDeps: { include: ['ethers'] }
		}
	},

	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
