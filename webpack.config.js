var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: [
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
        test: /\.less$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
      },
            {
            test: /\.jsx?$/,
            use: ['babel-loader'],
            include: path.join(__dirname, 'src')
        },
            {
                test: /\.(jpe?g|png|gif|svg|eot|woff2?|ttf|otf)(\?.*)?$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5120,
                        name: '[path][name].[hash].[ext]'
                    }
                }
            },
        {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
        ]
    }
};
