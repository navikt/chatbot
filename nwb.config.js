module.exports = {
  type: "react-component",
  npm: {
    umd: {
      global: "NAVChatBot",
      externals: {
        react: "React"
      }
    }
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
      }
    },
    rules: {
      svg: {
        loader: 'svg-inline-loader?classPrefix'
      }
    }
  }
};
