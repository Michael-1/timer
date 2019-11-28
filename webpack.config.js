module.exports = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /\/node_modules\//,
      use: {
        loader: 'babel-loader'
      }
    },{
      test: /\.s?css$/,
      exclude: /\/node_modules\//,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    }]
  }
}