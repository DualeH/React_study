const path = require('path')
// 配置Html模板
let HtmlWebpackPlugin = require('html-webpack-plugin')
// 拆分css
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
// 打包前先清空
let CleanWebpackPlugin = require('clean-webpack-plugin')
let webpack = require('webpack')
// 单页面配置
module.exports = {
    // 多页面配置
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, './dist')
    },
    devServer: {
        port: 3000,
        open: true,// 自动打开浏览器
        hot: true,// 开启热更新
        overlay: true,// 浏览器页面上显示错误
        historyApiFallback: true,
        contentBase: './dist'
    },
    resolve: {
        // 别名
        alias: {
            pages: path.join(__dirname, 'src/pages'),
            actions: path.join(__dirname, 'src/redux/actions')
        },
        // 省略后缀
        extensions: ['.js', '.jsx', '.json', '.css', '.less']
    },
    module: {
        rules: [
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            },
            {
                test:/\.js$/,
                use: 'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            },
            {
                test: /\.jsx$/,
                use: 'babel-loader',
                exclude: /node_modules/ // 排除掉node_modules，优化打包速度
            },
            {
                test: /\.less$/, // 解析less
                use: ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']// 从右向左解析
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    fallback: "style-loader",
                    use: ['css-loader']
                })
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/' // 图片打包后存放的目录
                        }
                    }
                ]
            },
            {// 页面img引用图片
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // resetCss,
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['vendor', 'index', 'utils'],//  引入需要的chunk
            hash: true
        }),
        new ExtractTextWebpackPlugin('css/style.css'),
        // 热更新，热更新不是刷新
        new webpack.HotModuleReplacementPlugin()
    ],
    // 提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: { // 抽离第三方插件
                    test: /node_modules/, // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',// 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                utils: {
                    // 抽离自己写的公共代码，utils里面是一个公共类库
                    chunks: 'initial',
                    name: 'utils', //  任意命名
                    minSize: 0 // 只要超出0字节就生成一个新包
                }
            }
        }
    }
}
// 多页面配置
// module.exports = {
//     entry: {
//         index: './src/index.js',
//         login: './src/login.js'
//     },
//     output: {
//         filename: "[name].js",
//         path: path.resolve(__dirname, './dist')
//     },
//     devServer: {
//       port: 3000,
//       contentBase: './dist'
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 use: 'babel-loader',
//                 exclude: /node_modules/
//             }
//         ]
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: './src/index.html',
//             filename: 'index.html',
//             chunks: ['index'],
//             hash: true
//         }),
//         new HtmlWebpackPlugin({
//             template: './src/login.html',
//             filename: 'login.html',
//             chunks: ['login'],
//             hash: true
//         })
//     ]
// }