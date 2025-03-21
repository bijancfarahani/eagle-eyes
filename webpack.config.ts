import path from "path";
import webpack from "webpack";
import "webpack-dev-server";

import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config: webpack.Configuration = {
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
   ],
};

export default config;
