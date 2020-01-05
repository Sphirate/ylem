const path = require("path");
const fs = require("fs");

const moduleNameMapper = fs.readdirSync(path.resolve(__dirname, "projects"))
    .reduce((acc, dirName) => ({ ...acc, [`^@ylem/${ dirName }$`]: `<rootDir>/projects/${ dirName }/src/index.ts` }), {});

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper,
};