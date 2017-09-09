const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'interactive-fragment-shader.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },
        {
            test: /\.(glsl|glslx|vs|fs)$/,
            loader: 'shader-loader',
            options: {
                // don't know yet, what this option is for
                glsl: {
                    chunkPath: path.resolve(__dirname,'./src/glsl/chunks')
                }
            }
        },
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          }
        ]
    },
    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ]
    },
    plugins: [
        new BrowserSyncPlugin({
            // browse to http://localhost:3000/ during development, 
            host: 'localhost',
            port: 3000,
            server: { baseDir: [''] }
        })
      ]
};