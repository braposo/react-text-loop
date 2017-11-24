/* eslint-env node */
var webpack = require("webpack");
var path = require("path");
var env = process.env.NODE_ENV;

var reactExternal = {
    root: "React",
    commonjs2: "react",
    commonjs: "react",
    amd: "React",
};

var reactDomExternal = {
    commonjs: "react-dom",
    commonjs2: "react-dom",
    amd: "ReactDOM",
    root: "ReactDOM",
};

var config = {
    externals: {
        react: reactExternal,
        "react-dom": reactDomExternal,
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ["babel-loader"],
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
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env),
        }),
    ],
};

// Special config for dev server
if (env === "dev-server") {
    config.externals = {};

    config.entry = {
        main: path.join(__dirname, "examples/index.js"),
    };

    config.output = {
        publicPath: "/",
        filename: "bundle.js",
    };
}

if (env === "production") {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                warnings: false,
            },
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    );
}

module.exports = config;
