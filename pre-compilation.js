let path = require('path');
let basePath = __dirname;
//let nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require( 'nodemon-webpack-plugin' );

module.exports = {
    context: path.join(basePath, 'src'),
    resolve: {
        // .js is required for react imports.
        // .tsx is for our app entry point.
        // .ts is optional, in case you will be importing any regular ts files.
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    target: "node",
    //externals: [nodeExternals()],

    node: {
        fs: "empty",
        net: "empty",
        tls: "empty"
    },
    entry: {
        app: [
            '../index.ts'
        ]
    },
    output: {
        path: path.join(basePath, './dist'),
        filename: 'project-l-backend.js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader'
                }]
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader',
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader',
            },
            {
                test: /\.(html)$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
            }
        ],
    },
    plugins: [
        new NodemonPlugin(), // Dong
    ],
};