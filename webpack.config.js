/* eslint-env node */
/* eslint import/no-commonjs: 0, import/no-nodejs-modules: 0 */
const webpack = require("webpack");
const path = require("path");

const reactExternal = {
    root: "React",
    commonjs2: "react",
    commonjs: "react",
    amd: "React",
};

const reactDomExternal = {
    commonjs: "react-dom",
    commonjs2: "react-dom",
    amd: "ReactDOM",
    root: "ReactDOM",
};

const config = {
    mode: process.env.NODE_ENV || "development",
    externals: {
        react: reactExternal,
        "react-dom": reactDomExternal,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: [path.join(__dirname, "./src/"), "node_modules"],
        extensions: [".js", ".jsx"],
    },
    output: {
        library: "ReactTextLoop",
        libraryTarget: "umd",
    },
    plugins: [new webpack.optimize.OccurrenceOrderPlugin()],
};

module.exports = config;
