import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const babelPlugin = babel({
    exclude: 'node_modules/**',
    plugins: [
        'external-helpers',
    ],
});

const baseConfig = {
    input: './src/index.js',
    output: {
        name: 'ylem',
        file: './lib/index.js',
        format: 'umd',
    },
    plugins: [
        babelPlugin,
    ],
};
const minConfig = {
    input: './src/index.js',
    output: {
        name: 'ylem',
        file: './lib/index.min.js',
        format: 'umd',
    },
    plugins: [
        babelPlugin,
        uglify(),
    ],
};

export default [baseConfig, minConfig];
