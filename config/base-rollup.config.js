import path from "path";
import fs from "fs";

import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const packageJSON = require(path.resolve(__dirname, "package.json"));

const projects = fs.readdirSync(path.resolve(__dirname, ".."))
    .map((dirName) => `@ylem/${ dirName }`);

const externals = [ ...projects, ...Object.keys(packageJSON.dependencies || {}) ];

export const getConfig = (packageName, external = externals) => [
    {
        input: './src/index.ts',
        output: {
            name: packageName,
            file: `./lib/index.js`,
            format: 'cjs',
            globals: {
                "@ylem/event-source": "YlemEventSource",
                "@ylem/core": "YlemCore",
                "@ylem/state": "YlemState",
            },
        },
        plugins: [
            typescript({ useTsconfigDeclarationDir: true }),
        ],
        external: externals,
    },
    {
        input: './src/index.ts',
        output: {
            name: packageName,
            file: `./dist/index.js`,
            format: 'umd',
            globals: {
                "@ylem/event-source": "YlemEventSource",
                "@ylem/core": "YlemCore",
                "@ylem/state": "YlemState",
            },
        },
        plugins: [
            typescript({ tsconfigOverride: { compilerOptions: { declaration: false } }}),
        ],
        external: external,
    },
    {
        input: './src/index.ts',
        output: {
            name: packageName,
            file: `./dist/index.min.js`,
            format: 'umd',
            globals: {
                "@ylem/event-source": "YlemEventSource",
                "@ylem/core": "YlemCore",
                "@ylem/state": "YlemState",
            },
        },
        plugins: [
            typescript({ tsconfigOverride: { compilerOptions: { declaration: false } }}),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false
                }
            }),
        ],
        external: external,
    }
];
