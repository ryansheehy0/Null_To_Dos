const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const WorkboxPlugin = require("workbox-webpack-plugin")
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './index.js', // Look first to build out the bundle
  devServer: {
    hot: 'only' // use the hot module reloading api
  },
  output: {
    filename: 'bundle.js', // Output js file name
    path: path.resolve(__dirname, 'dist'), // Path where to to output. Using file called dist which stands for distribution
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Optional. Name of outputted html file
    }),
    new MiniCssExtractPlugin(),
    new WorkboxPlugin.GenerateSW(),
    new WebpackPwaManifest({
      name: "Null Todos",
      short_name: "Null Todos",
      description: "A simple todo app that allows for nested todos.",
      start_url: "/",
      icons: {
        default: "./assets/logo.svg"
      },
      display: "standalone",
      theme_color: "#000000",
      background_color: "#000000"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i, // Looks for .css files
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
}