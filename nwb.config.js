module.exports = {
    type: 'react-component',
    browsers: '>0.01%',
    npm: {
        umd: {
            global: 'NAVChatBot',
            externals: {
                react: 'React',
                '@navikt/fnrvalidator': '@navikt/fnrvalidator',
                'styled-components': 'styled-components'
            }
        },
        cjs: false,
        esModules: false
    },
    webpack: {
        extra: {
            entry: './src/index',
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx', '.less']
            },
            module: {
                rules: [
                    {
                        test: /\.ts|\.tsx$/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    plugins: [
                                        [
                                            '@quickbaseoss/babel-plugin-styled-components-css-namespace',
                                            {
                                                cssNamespace: '#nav-chatbot'
                                            }
                                        ],
                                        'babel-plugin-styled-components'
                                    ]
                                }
                            },
                            'ts-loader'
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: ['style-loader', 'css-loader', 'less-loader']
                    }
                ]
            }
        },
        rules: {
            svg: {
                loader: 'svg-inline-loader'
            }
        },
        copy: [{from: './src/index.d.ts', to: './'}]
    }
};
