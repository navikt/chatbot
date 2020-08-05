const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  type: "react-component",
  npm: {
    umd: {
      global: "NAVChatBot",
      externals: {
        react: "React"
      }
    },
    esModules: true
  },
  polyfill: true,
  webpack: {
    extra: {
      entry: "./src/index",
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
      },
      module: {
        rules: [{ test: /\.ts|\.tsx$/, loader: "ts-loader" }]
      },
      plugins: [
        new MomentLocalesPlugin({localesToKeep: ['nb', 'nn', 'en']}),
      ],
      externals: {
        'react-app-polyfill/ie11': 'commonjs2 react-app-polyfill/ie11',
        'react-app-polyfill/stable': 'commonjs2 react-app-polyfill/stable',
        'object-hash': 'commonjs2 object-hash'
      }
    },
    rules: {
      svg: {
        loader: 'svg-inline-loader?classPrefix'
      }
    },
    copy: [
      {from: './src/index.d.ts', to:'./@navikt'}
    ]
  }
};
