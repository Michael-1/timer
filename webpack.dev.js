const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.js");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(baseConfig, {
  devServer: {
    host: "0.0.0.0"
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      title: "Timer",
      meta: { viewport: "width=device-width" }
    })
  ]
});
