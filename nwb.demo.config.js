module.exports = {
  type: 'react-component',
  polyfill: true,
  webpack: {
    extra: {
      entry: './demo/src/index',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      },
      module: {
        rules: [{ test: /\.tsx$/, loader: 'ts-loader' }]
      }
    },
    rules: {
      svg: {
        loader: 'svg-inline-loader?classPrefix'
      }
    }
  }
};
