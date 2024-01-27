import { RollupOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { join } from 'path';
import { readFileSync } from 'fs';

export default {
	input: 'source/application.ts',
	output: {
		file: 'distribution/application.js',
		format: 'cjs',
		generatedCode: {
			constBindings: true
		}
	},
	plugins: [typescript({
		module: 'ES2022'
	}), terser(), {
		name: '',
		generateBundle: function (): void {
			const libraryPath: string = join(__dirname, 'source/library/');

			for(const fileName of ['index.html', 'handle.html', 'favicon.ico', 'sitemap.xml']) {
				this.emitFile({
					type: 'asset',
					fileName: fileName,
					source: readFileSync(libraryPath + fileName)
				});
			}
		}
	}]
} satisfies RollupOptions;