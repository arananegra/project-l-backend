let path = require('path');
let basePath = __dirname;
//let nodeExternals = require('webpack-node-externals');
let CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    context: path.join(basePath, 'src'),
    resolve: {
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
                use: 'base64-inline-loader?limit=1000&username=[username].[ext]'
            }
        ],
    },
    plugins:[
        new CleanWebpackPlugin(['./dist'], {
            //root: basePath,
            verbose: true,   // Write logs to console
            dry: false,     // Use boolean "true" to test/emulate delete. (will not remove files).
                            // (Default: "false", remove files)
            watch: true     // If true, remove files on recompile. (Default: false)
        })
    ]
};