const DtsBundleWebpack = require("dts-bundle-webpack")
const TerserPlugin = require("terser-webpack-plugin")
const path = require("path")
const packageName = require("./package.json").name
const CopyPlugin = require("copy-webpack-plugin")

const toCamelCase = function (str) {
    return str
        .toLowerCase()
        .replace(/['"]/g, "")
        .replace(/\W+/g, " ")
        .replace(/ (.)/g, function ($1) {
            return $1.toUpperCase()
        })
        .replace(/ /g, "")
}
const libraryName = toCamelCase(packageName)

module.exports = (_env, options) => ({
    stats: "minimal",
    externals: {
        react: "react", // Case matters here
        "react-dom": "react-dom", // Case matters here
    },
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist-lib"),
        filename: "index.js",
        library: libraryName,
        libraryTarget: "umd",
        umdNamedDefine: true,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
            react: path.resolve("./node_modules/react"),
            reactDOM: path.resolve("./node_modules/react-dom"),
        },
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new DtsBundleWebpack({
            name: packageName,
            main: "build/index.d.ts",
            out: "../dist-lib/index.d.ts",
            removeSource: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    context: "src/",
                    from: "styles/*.*",
                    to: "./",
                    toType: "dir",
                },
            ],
        }),
    ],
    optimization: {
        minimize: options.mode === "production",
        minimizer: [new TerserPlugin()],
    },
})
