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
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
            },
            module: {
                rules: [{ test: /\.ts|\.tsx$/, loader: 'ts-loader' }],
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
