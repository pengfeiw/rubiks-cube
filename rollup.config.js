import typescript from "rollup-plugin-typescript2";

export default {
    input: 'src/index.ts',
    output: {
        file: "dist/index.js",
        format: "iife",
        sourcemap: true
    },
    plugins: [
        typescript({typescript: require("typescript")})
    ]
};
