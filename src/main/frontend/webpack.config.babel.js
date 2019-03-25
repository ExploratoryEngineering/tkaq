/*
	Copyright 2019 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

const path = require("path");
const fs = require("fs");
const pkg = require("./package.json");

const {
  optimize: { ModuleConcatenationPlugin },
  ContextReplacementPlugin,
  DefinePlugin,
  ProvidePlugin,
} = require("webpack");
const { AureliaPlugin } = require("aurelia-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const autoprefixer = require("autoprefixer");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// config helpers:
const ensureArray = (config) => (config && (Array.isArray(config) ? config : [config])) || [];
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig);

// primary config:
const title = "TKAQ";
const outDir = path.resolve(__dirname, "../resources/public");
const srcDir = path.resolve(__dirname, "src");
const baseUrl = "/";
const buildVersion = `v${pkg.version}-${new Date().toISOString()}`;

fs.writeFileSync("version.json", JSON.stringify({ version: buildVersion }), (err) => {});

const sassLoaderConfig = [
  {
    loader: "css-loader", // translates CSS into CommonJS
    options: {
      importLoaders: 2,
    },
  },
  {
    loader: "postcss-loader", // adding needed prefixer for older browsers
    options: {
      ident: "postcss",
      plugins: () => [autoprefixer({ browsers: ["last 2 versions"] })],
      postcss: {},
    },
  },
  {
    loader: "sass-loader", // compiles sass to CSS,
    options: {
      includePaths: ["styles"],
    },
  },
];

module.exports = ({
  production,
  analyze,
  server,
  coverage,
  tkaqEndpoint = "https://tkaq.herokuapp.com/",
  tkaqWsEndpoint = "wss://tkaq.herokuapp.com",
} = {}) => ({
  resolve: {
    extensions: [".ts", ".js"],
    modules: [srcDir, "node_modules"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
    alias: {
      "aurelia-pal": path.resolve("node_modules/aurelia-pal/dist/commonjs/aurelia-pal.js"),
      "aurelia-binding": path.resolve(__dirname, "node_modules/aurelia-binding"),
    },
  },
  devtool: production ? "source-map" : "cheap-module-eval-source-map",
  entry: {
    app: ["aurelia-bootstrapper"],
  },
  mode: production ? "production" : "development",
  performance: { hints: false },
  output: {
    path: outDir,
    publicPath: baseUrl,
    filename: production ? "[name].[chunkhash].bundle.js" : "[name].[hash].bundle.js",
    sourceMapFilename: production ? "[name].[chunkhash].bundle.map" : "[name].[hash].bundle.map",
    chunkFilename: production ? "[name].[chunkhash].chunk.js" : "[name].[hash].chunk.js",
  },
  devServer: {
    contentBase: outDir,
    // serve index.html for all 404 (required for push-state)
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        issuer: [{ test: /\.html$/i }],
        // CSS required in templates cannot be extracted safely
        // because Aurelia would try to require it again in runtime
        use: sassLoaderConfig,
      },
      {
        test: /\.s?[c]ss$/,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: ["style-loader", ...sassLoaderConfig],
      },
      { test: /\.html$/i, loader: "html-loader" },
      { test: /\.ts$/i, loader: "ts-loader" },
      // use Bluebird as the global Promise implementation:
      { test: /[/\\]node_modules[/\\]bluebird[/\\].+\.js$/, loader: "expose-loader?Promise" },
      // embed small images and fonts as Data Urls and larger ones as files:
      { test: /\.(png|gif|jpg|cur)$/i, loader: "url-loader", options: { limit: 8192 } },
      {
        test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/font-woff2" },
      },
      {
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/font-woff" },
      },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: "file-loader" },
      ...when(coverage, {
        test: /\.[jt]s$/i,
        loader: "istanbul-instrumenter-loader",
        include: srcDir,
        exclude: [/\.{spec,test}\.[jt]s$/i],
        enforce: "post",
        options: { esModules: true },
      }),
      {
        test: /\.js$/,
        use: ["ify-loader"],
      },
    ],
  },
  plugins: [
    new AureliaPlugin({
      features: { svg: true, unparser: false, polyfills: "es2015" },
    }),
    new ProvidePlugin({
      Promise: "bluebird",
    }),
    new HtmlWebpackPlugin({
      template: "index.ejs",
      minify: production
        ? {
            removeComments: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            minifyCSS: true,
            minifyJS: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            ignoreCustomFragments: [/\${.*?}/g],
          }
        : undefined,
      metadata: {
        // available in index.ejs //
        title,
        server,
        baseUrl,
        production,
        buildVersion,
      },
    }),
    new ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(en)$/),
    new CopyWebpackPlugin([
      {
        from: "version.json",
        to: "version.json",
      },
      {
        from: "fonts/",
        to: "fonts/",
      },
      {
        from: "images/",
        to: "images/",
      },
      {
        from: "favicon.ico",
        to: "favicon.ico",
      },
    ]),
    new DefinePlugin({
      TKAQ_ENDPOINT: JSON.stringify(tkaqEndpoint),
      TKAQ_WS_ENDPOINT: JSON.stringify(tkaqWsEndpoint),
      PRODUCTION: JSON.stringify(production),
    }),
    ...when(production, new ModuleConcatenationPlugin()),
    ...when(analyze, new BundleAnalyzerPlugin()),
  ],
});
