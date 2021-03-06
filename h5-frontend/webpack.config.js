const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const projectConfig = require('./project.config.json');
const { initEntry } = require('./utils/build-entry');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const entry = initEntry();

  const output = {
    path: path.resolve(__dirname, 'static'),
    filename: '[name]/index.js',
    chunkFilename: 'chunks/[name].[chunkhash].js',
    publicPath: projectConfig.base[env].publicPath,
  };

  const resolve = {
    extensions: [
      '.js', '.jsx', '.ts', '.tsx',
    ],
    alias: {
      Components: path.resolve(__dirname, 'public/components'),
      Pages: path.resolve(__dirname, 'public/pages'),
      Constants: path.resolve(__dirname, 'public/constants'),
      Utils: path.resolve(__dirname, 'public/utils'),
      Service: path.resolve(__dirname, 'public/utils/service'),
    },
  };

  const htmlWebpackPluginList = env !== 'dev' ? Object.keys(initEntry()).map(en => {
    return new HtmlWebpackPlugin({
      filename: `${en}/index.html`,
      template: './utils/index.ejs',
      inject: 'body',
      title: '加载中...',
      chunks: [en],
      environment: projectConfig.base[env].publicPath,
      // favicon: path.resolve('./public/images/favicon.ico'),
    });
  }) : [];

  const plugins = [
    ...htmlWebpackPluginList,
    new MiniCssExtractPlugin({
      filename: '[name]/index.css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env),
        'config': JSON.stringify(projectConfig.base[env]),
      },
    }),
  ];

  // const optimization = {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     chunks: 'async',
  //     minSize: 30000,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 5,
  //     automaticNameDelimiter: '~',
  //     cacheGroups: {
  //       vendor: {
  //         chunks: 'initial',
  //         test: /node_modules/,
  //         name: 'vendor',
  //         minSize: 0,
  //         minChunks: 1,
  //         enforce: true,
  //         maxAsyncRequests: 5,
  //         maxInitialRequests: 3,
  //         reuseExistingChunk: true,
  //       },
  //     },
  //   },
  // };

  const fileLoaders = env !== 'dev' ? [{
    loader: 'file-loader',
    options: {
      name(file) {
        const filePath = path.normalize(file);
        const fileSplit = filePath.split(path.sep);
        const contextProjectPath = fileSplit[fileSplit.length - 3];
        const beforeProjectPath = fileSplit[fileSplit.length - 4];
        if (beforeProjectPath === 'pages') return `${contextProjectPath}/images/[name].[ext]?[hash]`;
        else return 'images/[name].[ext]?[hash]';
      },
    },
  }, {
    loader: 'image-webpack-loader',// 压缩图片
  }] : [{
    loader: 'file-loader',
    options: {
      name(file) {
        const filePath = path.normalize(file);
        const fileSplit = filePath.split(path.sep);
        const contextProjectPath = fileSplit[fileSplit.length - 3];
        const beforeProjectPath = fileSplit[fileSplit.length - 4];
        if (beforeProjectPath === 'pages') return `${contextProjectPath}/images/[name].[ext]?[hash]`;
        else return 'images/[name].[ext]?[hash]';
      },
    },
  }];

  const module = {
    rules: [{
      test: [
        /\.js$/, /\.jsx$/,
      ],
      exclude: env !== 'dev' ? [] : [path.resolve(__dirname, 'node_modules')],
      use: [{
        loader: 'babel-loader',
        options: {
          // presets: [
          //   '@babel/preset-env', '@babel/preset-react',
          // ],
          // plugins: [
          //   '@babel/plugin-syntax-dynamic-import',
          //   ['@babel/plugin-proposal-decorators', { 'legacy': true }],
          //   ['@babel/plugin-proposal-class-properties', { 'loose': true }],
          //   'dynamic-import-webpack',
          //   ['import', { libraryName: 'antd-mobile', style: true }],
          // ],
          presets: [
            '@babel/preset-react',
            '@babel/preset-env',
            // ['@babel/preset-env', {
            //   // useBuiltIns: 'entry',
            //   // 'useBuiltIns': 'usage',
            //   // 'corejs': 3,
            //   // 'modules': 'commonjs',
            //   // 'targets': {
            //   //   // 'browsers': ['IE >= 6', 'Android >= 1.0', 'iOS >= 5'],
            //   //   'browsers': ['> 1%'],
            //   // },
            // }],
          ],
          plugins: [
            // [ '@babel/plugin-transform-runtime', { corejs: 3 } ], 
            '@babel/plugin-syntax-dynamic-import',
            ['@babel/plugin-proposal-decorators', { 'legacy': true }],
            ['@babel/plugin-proposal-class-properties', { 'loose': true }],
            'dynamic-import-webpack',
            ['import', { libraryName: 'antd-mobile', style: true }],
          ],
        },
      }],
    }, {
      test: [
        /\.ts$/, /\.tsx$/,
      ],
      exclude: env !== 'dev' ? [] : [path.resolve(__dirname, 'node_modules')],
      use: [{
        loader: 'babel-loader',
        // options: {
        //   presets: [
        //     '@babel/preset-env', '@babel/preset-react',
        //   ],
        //   plugins: [
        //     '@babel/plugin-syntax-dynamic-import',
        //     'dynamic-import-webpack',
        //     ['import', { libraryName: 'antd-mobile', style: 'less' }],
        //   ],
        // },
        options: {
          presets: [
            '@babel/preset-react',
            '@babel/preset-env',
            // ['@babel/preset-env', {
            //   useBuiltIns: 'entry',
            //   'useBuiltIns': 'usage',
            //   'corejs': 3,
            //   'modules': 'commonjs',
            //   'targets': {
            //     // 'browsers': ['IE >= 6', 'Android >= 1.0', 'iOS >= 5'],
            //     'browsers': ['> 1%'],
            //   },
            // }],
          ],
          plugins: [
            // ['@babel/plugin-transform-runtime', { corejs: 3 }],
            '@babel/plugin-syntax-dynamic-import',
            'dynamic-import-webpack',
            ['import', { libraryName: 'antd-mobile', style: 'less' }],
          ],
        },
      }, 'ts-loader'],
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, 'css-loader', {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('autoprefixer')(),
            require('./utils/postcss-px-to-rem-vw')(),
          ],
        },
      }],
    }, {
      test: /\.less$/,
      exclude: /node_modules/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          minimize: true,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('autoprefixer')(),
            require('./utils/postcss-px-to-rem-vw')(),
          ],
        },
      }, {
        loader: 'less-loader',
        options: {
          paths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'public/styles'),
          ],
          javascriptEnabled: true,
        },
      }],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'url-loader',
      include: [
        path.resolve(__dirname, 'public'),
        path.resolve(__dirname, 'project.config.json'),
      ],
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: fileLoaders,
      include: [
        path.resolve(__dirname, 'public'),
        path.resolve(__dirname, 'project.config.json'),
      ],
    }],
  };

  //配置此静态文件服务器，可以用来预览打包后项目
  const devServer = {
    inline: true, //打包后加入一个websocket客户端
    hot: true, //热重载
    contentBase: path.resolve(__dirname, './'), //开发服务运行时的文件根目录
    host: 'localhost', //主机地址
    port: projectConfig.server.hmr.port, //端口号
    compress: true, //开发服务器是否启动gzip等压缩
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };

  return {
    entry,
    output,
    resolve,
    plugins,
    // optimization,
    module,
    devServer,
  };
};
