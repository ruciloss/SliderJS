const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },
    mode: 'production',
    entry: {
        sliderjs: './src/js/index.js',
        sliderjsCSS: './src/scss/index.scss'
    },
    output: {
        filename: 'js/[name].min.js',
        path: __dirname + '/dist',
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                        },
                    },
                    { loader: 'sass-loader' },
                ],
            }
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: /@license|@preserve|^!/i, 
                    },
                },
            }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'css/sliderjs.min.css' }),
        new IgnoreEmitPlugin([
            'sliderjsCSS.min.js',
        ]),
        new webpack.BannerPlugin({
            banner: 
`SliderJS
https://ruciloss.github.io
Author Ruciloss
Released under the MIT License
Build date: ${new Date().toLocaleString()}`,
        }),
    ],
};
