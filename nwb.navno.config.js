module.exports = {
  type: 'react-component',
  polyfill: true,
  webpack: {
    extra: {
      entry: './demo/src/index',
      publicPath: '/person/chatbot/test',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      },
      module: {
        rules: [{ test:  /\.ts|\.tsx$/, loader: 'ts-loader' }]
      }
    },
    rules: {
      svg: {
        loader: 'svg-inline-loader?classPrefix'
      }
    }
  }
};
