const path = require("path");
module.exports = {
  //entry是程序的入口, 创建自己的js或ts，我用的是index.ts
  entry: "./src/excel.js",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx"]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath:'/'
  }
};