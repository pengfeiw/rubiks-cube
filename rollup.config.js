import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import{nodeResolve} from "@rollup/plugin-node-resolve";

export default {
    input: 'src/index.ts',
    output: {
        file: "dist/index.js",
        name: "rubik",
        format: "iife",
        sourcemap: true
    },
    plugins: [
        typescript({typescript: require("typescript")}),
        commonjs({
            include: ["node_modules/**", "src/index.ts"],
            ignoreGlobal: false,
            sourceMap: false
        }),
        nodeResolve({browser: true, preferBuiltins: false})
    ]
};
