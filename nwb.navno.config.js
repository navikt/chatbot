module.exports = {
    type: 'react-component',
    polyfill: true,
    webpack: {
        html: {
            mountId: 'demo'
        },
        publicPath: '/person/chatbot/test',
        extra: {
            entry: './demo/src/index',
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx']
            },
            module: {
                rules: [
                    {
                        test: /\.ts|\.tsx$/,
                        loader: 'ts-loader'
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
