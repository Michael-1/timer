const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.js");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../timer-dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      inject: "body",
      inlineSource: ".(js|css)$"
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new FaviconsWebpackPlugin({
      logo: "./assets/favicon.svg",
      outputPath: "favicon",
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
    new OptimizeCssAssetsPlugin()
  ]
});
