// rollup.config.js
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
// import { scss } from 'svelte-preprocess';
import preprocess from "svelte-preprocess";

const production = !process.env.ROLLUP_WATCH;
const public_loc = 'public'


function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

// get author names
const { exec } = require("child_process");
var author = '';
exec("git for-each-ref --format='%(authorname)' | sort -k5n -k2M -k3n -k4n", (error, stdout, stderr) => {
    var set = new Set(stdout.split('\n'))
		author = [...set].join(',')
    console.log(`Commit Authors:\n  ${author}`);
});


export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'ONSCensusAtlas',
		authors: author,
		file: public_loc+'/build/bundle.js'
	},
	plugins: [

		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
			// preprocess: preprocess({
			// 	scss: {
			// 	  includePaths: ["./node_modules/normalize.css/"],
			// 	},
			//   }),
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload(public_loc),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser({ output: { comments: false } })
	],
	watch: {
		clearScreen: false
	}
};
