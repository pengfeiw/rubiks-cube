import config from "./rollup.config";
import serve from "rollup-plugin-serve";

config.plugins = [
    ...config.plugins,
    serve({
        open: true,
        openPage: "/example/index.html",
        contentBase: "",
        port: 8080
    })
]

export default config;
