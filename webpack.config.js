// const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "development",
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  chrome: "77"
                }
              }
            ]
          ],
          plugins: ["@babel/plugin-syntax-dynamic-import"]
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              // options...
            }
          }
        ]
      }
    ]
  },
  resolve: {
    mainFields: ["esm2017", "browser", "main"]
  },
  stats: {
    colors: true
  },
  devtool: "source-map",
  devServer: {
    contentBase: "./build",
    watchContentBase: true,
    compress: true
  },
  plugins: [
    new CopyPlugin([
      { from: `./src/index.html`, to: `./index.html` }
    ]),
    new MiniCssExtractPlugin({
      filename: 'css/mystyles.css'
    }),
  ]
};
