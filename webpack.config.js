const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const userpath = path.resolve(__dirname, "src/js/user");


module.exports = {
    mode:"development",
    entry: [
        "core-js/stable/promise",
        userpath + "/testUser.js"
    ],
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "[name]_bundle.js"
    },
    target: ['web', 'es5'],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [[
                            "@babel/preset-env",{
                                "useBuiltIns" : "entry",
                                "corejs": 3,
                                "targets" : {
                                    "browsers": ["ie >= 10"]
                                },
                                "shippedProposals": true
                            }
                        ]],
                        plugins: [
                            "@babel/plugin-transform-runtime"
                        ]
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    devtool: 'source-map'
}