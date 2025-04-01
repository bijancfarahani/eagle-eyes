// @ts-check

import path from "path";
import "webpack-dev-server";
import Dotenv from "dotenv-webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** @type {import('webpack').Configuration} */
const config = {
   context: path.resolve(__dirname, "src"),
   entry: "./game.ts",
   output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[chunkhash].js",
      chunkFilename: "[name].[chunkhash].js",
      clean: true,
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            include: path.resolve(__dirname, "src"),
            loader: "ts-loader",
         },
      ],
   },
   devServer: {
      static: path.join(__dirname, "dist"),
      port: 7354,
      proxy: [
         {
            context: ["/nakama"],
            target: "http://localhost:7350",
            pathRewrite: { "^/nakama": "" },
            secure: false,
            changeOrigin: true,
         },
      ],
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   performance: {
      maxAssetSize: 1000000,
   },
   plugins: [
      new CopyWebpackPlugin({
         patterns: [
            {
               from: "assets",
               to: "assets",
            },
         ],
      }),
      new HtmlWebpackPlugin({
         template: path.resolve(__dirname, "src/index.html"),
         title: "Eagle Eyes",
         inject: "head",
      }),
      new Dotenv(),
   ],
};

export default config;
