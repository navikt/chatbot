module.exports = {
    type: 'react-component',
    webpack: {
        extra: {
            entry: './demo/src/index',
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx', '.less']
            },
            module: {
                rules: [
                    {test: /\.ts|\.tsx$/, loader: 'ts-loader'},
                    {
                        test: /\.less$/,
                        use: [
                            {
                                loader: 'style-loader'
                            },
                            {
                                loader: 'css-loader'
                            },
                            {
                                loader: 'less-loader'
                            }
                        ]
                    }
                ]
            }
        },
        rules: {
            svg: {
                loader: 'svg-inline-loader?classPrefix'
            }
        }
    }
};
