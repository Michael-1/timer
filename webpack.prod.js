/* eslint-disable no-undef */
const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      inject: "body",
      inlineSource: ".(js|css)$"
    }),
    new FaviconsWebpackPlugin({
      logo: "./assets/favicon.svg",
      outputPath: "assets",
      favicons: {
        appName: "Timer",
        developerName: "Michael Schmid",
        appleStatusBarStyle: "default",
        theme_color: "#ff6161",
        icons: {
          coast: false,
          yandex: false
        }
      }
    }),
  ], 
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
});
