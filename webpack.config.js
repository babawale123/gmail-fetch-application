const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true
    },
    entry: ["core-js", "regenerator-runtime", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        assetModuleFilename: "[name][ext]",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.css$/, 
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpg|jpeg|gif|png|gif|svg|ico)$/,
                type: "asset/resource"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./public/index.html", favicon: "./public/MI.png"}),
        new webpack.ProvidePlugin({process: "process"})
    ],
    resolve: {
        fallback: {
            util: require.resolve("util/"),
            process: require.resolve("process/browser"),
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify")
        },
        extensions: [".js", ".jsx"]
    }
}
