const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'traversable-menu': './src/js/index.ts'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    // library: {
    //   name: "traversable-menu",
    //   type: "umd"
    // }
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['ts', 'tsx']
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          {
          from:  path.resolve(__dirname, 'src/css'),
          to: path.resolve(__dirname, 'dist')
          }
        ]
      }
    )
  ],
};