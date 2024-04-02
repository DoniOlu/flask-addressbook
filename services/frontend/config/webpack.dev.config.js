const { merge } = require("webpack-merge");
const baseConfig = require("../webpack.config");

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    static: "./dist",
    hot: true,
    port: 5000,
    client: {
      logging: "info",
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
  },
});
