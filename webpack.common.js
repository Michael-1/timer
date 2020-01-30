const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      inject: "body",
      title: "Timer",
      meta: { viewport: "width=device-width" },
      template: "./index.html"
    }),
    new FaviconsWebpackPlugin({
      logo: "./favicon.svg",
      favicons: {
        appName: "Timer",
        appleStatusBarStyle: "default",
        icons: {
          coast: false,
          yandex: false
        }
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s?css$/,
        exclude: /\/node_modules\//,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  }
};
