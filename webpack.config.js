var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'app', 'app.js'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public/build'),
        publicPath: path.resolve(__dirname, 'public/build')
    },

    plugins:[
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),


    ],


    module: {
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel',
                test: /\.js$/,
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style',
                    'css?modules&importLoaders=1' +
                    '&localIdentName=[name]__[local]___[hash:base64:5]'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: 'url-loader?limit=10000&name=assets/[hash].[ext]'
            }
        ]
    }
};