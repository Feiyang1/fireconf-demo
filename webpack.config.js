// const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: './src/new/main.js',
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
  plugins: [new CopyPlugin([
      { from: `./src/new/index.html`, to: `./index.html` },
  ])]
};
