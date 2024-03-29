/* eslint-disable no-undef */
const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.js");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    host: "0.0.0.0"
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      title: "Timer"
    })
  ]
});
