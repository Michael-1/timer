const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.js");

module.exports = merge(baseConfig, {
  devServer: {
    host: "0.0.0.0"
  },
  devtool: "source-map"
});
