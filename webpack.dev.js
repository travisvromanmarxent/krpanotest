module.exports = (env, argv) => {
    const path = require('path');
    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
    const CopyWebpackPlugin = require('copy-webpack-plugin');

    const htmlWebpackPlugin = new HtmlWebpackPlugin({
        inject: 'body',
        chunks: ['main'],
        template: 'test/index.html',
    });

    const version = require('./package.json').version;
    const environmentVars = {
        VERSION: version,
        LOCAL_PATH: './', //so we can test latest
    };

    const pluginArray = [
        htmlWebpackPlugin,
        new CopyWebpackPlugin({
            patterns: [
                { from: './vendor/webvr.js', to: './vendor/webvr.js' },
                { from: './vendor/gyro2.js', to: './vendor/gyro2.js' },
                { from: './test/pano_test_0.png', to: './pano_test_0.png' },
                { from: './test/pano_test_1.png', to: './pano_test_1.png' },
                { from: './test/pano_test_2.png', to: './pano_test_2.png' },
            ],
        }),
        new HtmlWebpackHarddiskPlugin(),
        new webpack.EnvironmentPlugin(environmentVars),
    ];

    return {
        entry: {
            main: path.resolve(__dirname, 'src/init'),
        },
        output: {
            filename: 'js/[name].[hash].bundle.js',
            path: path.resolve(__dirname, 'webglpackage'),
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: [path.resolve(__dirname, 'src')],
                    use: {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsbuildconfig.json', //use own ts config that doesnt output declarations b/c ts-loader doesnt support project references: https://github.com/TypeStrong/ts-loader/issues/851
                        },
                    },
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                sources: {
                                    list: [
                                        // All default supported tags and attributes
                                        '...',
                                        {
                                            tag: 'img',
                                            attribute: 'data-src',
                                            type: 'src',
                                        },
                                        {
                                            tag: 'img',
                                            attribute: 'data-image',
                                            type: 'src',
                                        },
                                        {
                                            tag: 'img',
                                            attribute: 'data-inverse',
                                            type: 'src',
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(gif|png|jpe?g)$/i,
                    type: 'asset',
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        plugins: pluginArray,
        devServer: {
            // contentBase: path.join(__dirname, 'dist'),
            compress: true, // use gzip compression
            // https: true,
            port: 4000,
            // host: "127.0.0.1",
            client: {
                overlay: true,
            },
            open: false,
            hot: true,
            
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
        watchOptions: {
            ignored: /node_modules(?!\/(mxt-))/,
        },
    };
};
