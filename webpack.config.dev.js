import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  mode: "development",
  devtool: "inline-source-map",
  entry: [path.resolve(__dirname, "./client/src/app/index.js")],
  target: "web",
  output: {
    path: path.resolve(__dirname, "./client/src"),
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/src/app/index.html",
      inject: true
    })
  ],
  resolve: {
    alias: {
      fs: "pdfkit/js/virtual-fs.js"
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        enforce: "post",
        test: /fontkit[/\\]index.js$/,
        loader: "transform-loader?brfs"
      },
      {
        enforce: "post",
        test: /unicode-properties[/\\]index.js$/,
        loader: "transform-loader?brfs"
      },
      {
        enforce: "post",
        test: /linebreak[/\\]src[/\\]linebreaker.js/,
        loader: "transform-loader?brfs"
      },
      {test: /src[/\\]assets/, loader: "arraybuffer-loader"},
      {test: /\.afm$/, loader: "raw-loader"}
    ]
  }
};
