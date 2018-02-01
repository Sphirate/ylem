import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const baseConfig = {
    input: './src/index.js',
    output: {
        name: 'ylem',
        file: './lib/index.js',
        format: 'umd',
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
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
        babel({
            exclude: 'node_modules/**',
        }),
        uglify(),
    ],
};

export default [baseConfig, minConfig];
