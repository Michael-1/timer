const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.js");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const SocialTags = require("social-tags-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../timer-dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      title: "Timer",
      meta: {
        description: "A simple, beautiful timer for meetings and workshops",
        viewport: "width=device-width"
      },
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
    new SocialTags({
      appUrl: "https://timer.pizza/",
      facebook: {
        "og:title": "Pizza Timer",
        "og:determiner": "the",
        "og:type": "website",
        "og:image": "./assets/og.png",
        "og:image:alt": "Screenshot",
        "og:image:width": "3600",
        "og:image:height": "1881",
        "og:description":
          "A simple, beautiful timer for meetings and workshops",
        "og:url": "https://timer.pizza"
      }
    })
  ]
});
