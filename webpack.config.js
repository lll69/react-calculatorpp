import path from "node:path";
import CopyPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import HtmlMinimizerPlugin from "html-minimizer-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const __dirname = import.meta.dirname;

export default {
  entry: {
    calc: "./web/calc.tsx",
    cpp_worker: "./web/cpp_worker.ts",
  },
  module: {
    rules: [
      {
        test: /\.[mc]?[t]sx?$/i,
        use: [
          "ts-loader",
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "static", to: "" },
      ]
    }),
  ],
  resolve: {
    modules: ["node_modules"],
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            passes: 5
          }
        }
      }),
      new HtmlMinimizerPlugin({
        minimizerOptions: {
          conservativeCollapse: false
        }
      }),
      new CssMinimizerPlugin()
    ]
  }
};
