module.exports = {
  mode: "development",
  devServer: {
    host: "0.0.0.0"
  },
  devtool: "source-map",
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
