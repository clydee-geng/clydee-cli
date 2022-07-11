const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const FIGLET_FONT_NAME = "ANSI Shadow";

module.exports = {
  mode: "production",
  entry: {
    "clydee-cli": [path.resolve(__dirname, "./bin/index.js")],
  },
  output: {
    path: path.resolve(__dirname, "./dist/dist"), // figlet 找字体文件时的路径时../fonts, 为了把copy后的fonts文件也放在dist目录里，所以把主文件的入口加深一级
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: path.resolve(__dirname, "./bin/index.js"),
            loader: "shebang2-loader",
          },
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  plugins: [["@babel/plugin-transform-runtime"]],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".d.ts", ".ts", ".tsx"],
    mainFiles: ["index"],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
    new webpack.DefinePlugin({
      FIGLET_FONT_NAME: JSON.stringify(FIGLET_FONT_NAME),
    }),
    new CopyPlugin([
      {
        from: path.resolve(
          __dirname,
          "node_modules",
          "figlet",
          "fonts",
          `${FIGLET_FONT_NAME}.flf`
        ),
        to: "../fonts", // figlet 找字体文件时的路径时../fonts
      },
    ]),
  ],
  target: "node",
  node: {
    __dirname: false,
  },
};
