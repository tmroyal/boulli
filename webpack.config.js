const path = require('path');

module.exports = {
    target: 'web',
    mode: 'development',
    watch: true,
    entry: './src/app.js',
    module: {
        rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                }
        ]
    },
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {
        mathjax: 'MathJax'
    }
};
