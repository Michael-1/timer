const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.js");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      title: "Timer",
      meta: { viewport: "width=device-width" },
      inlineSource: ".(js|css)$"
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new FaviconsWebpackPlugin({
      logo: "./favicon.svg",
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
    })
  ]
});
