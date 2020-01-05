import path from "path";

import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const tsConfigBuildPath = path.resolve(__dirname, "tsconfig.build.json");
const packageJSON = require(path.resolve(__dirname, "package.json"));

const externals = [ ...Object.keys(packageJSON.dependencies || {}) ];

const globals = {
    "@ylem/event-source": "YlemEventSource",
    "@ylem/core": "YlemCore",
    "@ylem/state": "YlemState",
};

export const getConfig = (packageName, external = externals) => [
    {
        input: './src/index.ts',
        output: {
            name: packageName,
            file: `./lib/index.js`,
            format: 'cjs',
            globals,
        },
        plugins: [
            typescript({ useTsconfigDeclarationDir: true, tsconfig: tsConfigBuildPath }),
        ],
        external: externals,
    },
    {
        input: './src/index.ts',
        output: {
            name: packageName,
            file: `./dist/index.js`,
            format: 'umd',
            globals,
        },
        plugins: [
            typescript({ tsconfigOverride: { compilerOptions: { declaration: false, composite: false }, tsconfig: tsConfigBuildPath }}),
        ],
        external: external,
    },
    {
        input: './src/index.ts',
        output: {
            name: packageName,
            file: `./dist/index.min.js`,
            format: 'umd',
            globals,
        },
        plugins: [
            typescript({ tsconfigOverride: { compilerOptions: { declaration: false, composite: false }, tsconfig: tsConfigBuildPath }}),
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
