module.exports = {
    type: 'react-component',
    npm: {
        umd: {
            global: 'NAVChatBot',
            externals: {
                react: 'React',
                moment: 'moment',
                'react-app-polyfill/ie11': 'react-app-polyfill/ie11',
                'react-app-polyfill/stable': 'react-app-polyfill/stable',
            },
        },
        cjs: false,
        esModules: false,
    },
    webpack: {
        extra: {
            entry: './src/index',
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx', '.less'],
            },
            module: {
                rules: [
                    { test: /\.ts|\.tsx$/, loader: 'ts-loader' },
                    {
                        test: /\.less$/,
                        use: [
                            {
                                loader: 'style-loader',
                            },
                            {
                                loader: 'css-loader',
                            },
                            {
                                loader: 'less-loader',
                            },
                        ],
                    },
                ],
            },
        },
        rules: {
            svg: {
                loader: 'svg-inline-loader?classPrefix',
            },
        },
        copy: [{ from: './src/index.d.ts', to: './' }],
    },
};
