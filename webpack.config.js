const path=require('path');
const webpack = require("webpack");
const glob = require("glob");
//消除冗余的css
const purifyCssWebpack = require("purifycss-webpack");
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
// 清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");
//4.x之前用以压缩
const uglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
// 分离css
const extractTextPlugin = require("extract-text-webpack-plugin");
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");
module.exports={
    // 多入口文件
    entry: {
        index:"./src/index.js",
        index1:"./src/index1.js",
        jquery: 'jquery'
    },
    output: {
        // 打包多出口文件
        // 生成 index.bundle.js  index1.bundle.js  jquery.bundle.js
        path: path.resolve(__dirname,'dist'),
        filename:'[name].boundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        host: "localhost",
        port: "8090",
        open: true, // 开启浏览器
        hot: true   // 开启热更新
    },
    // devtool: "source-map",  // 开启调试模式
    module:{
        rules:[
            {
                test: /\.css$/,
                // 不分离的写法
                // use: ["style-loader", "css-loader"]
                // 使用postcss不分离的写法
                // use: ["style-loader", "css-loader", "postcss-loader"]
                // 此处为分离css的写法
                /*use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                    // css中的基础路径
                    publicPath: "../"

                })*/
                // 此处为使用postcss分离css的写法
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader"],
                    // css中的基础路径
                    publicPath: "./"
                })
            },
            {
                test: /\.js$/,
                use: ["babel-loader"],
                // 不检查node_modules下的js文件
                exclude: "/node_modules/"
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    // 需要下载file-loader和url-loader
                    loader: "url-loader",
                    options: {
                        limit: 50,
                        // 图片文件输出的文件夹
                        outputPath: "images"
                    }
                }
                ]
            },
            {
                test: /\.html$/,
                // html中的img标签
                use: ["html-withimg-loader"]
            },
            {
                test: /\.less$/,
                // 三个loader的顺序不能变
                // 不分离的写法
                // use: ["style-loader", "css-loader", "less-loader"]
                // 分离的写法
                use: extractTextPlugin.extract({
                    fallback:"style-loader",
                    use: ["css-loader", "less-loader"]
                })
            },
            {
                test: /\.(scss|sass)$/,
                // sass不分离的写法，顺序不能变
                // use: ["style-loader", "css-loader", "sass-loader"]
                // 分离的写法
                use: extractTextPlugin.extract({
                    fallback:"style-loader",
                    use: ["css-loader", "sass-loader"]
                })
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // 调用之前先清除
        new cleanWebpackPlugin(["dist"]),
        // 4.x之前可用uglifyjs-webpack-plugin用以压缩文件，4.x可用--mode更改模式为production来压缩文件
        // new uglifyjsWebpackPlugin(),
        new copyWebpackPlugin([{
            from: path.resolve(__dirname,"src/assets"),
            to: './pulic'
        }]),
        // 分离css插件 参数为提取出去的路径
        new extractTextPlugin("css/index.css"),
        // 消除冗余的css代码
        new purifyCssWebpack({
            // glob为扫描模块，使用其同步方法
            paths: glob.sync(path.join(__dirname, "src/*.html"))
        }),
        new htmlWebpackPlugin({
            title:'1',
            filename:'index.html',
            template:'./src/template/index.html',
            chunks:['index','jquery'],
            //filename:'login.html'
        }),
        // 自动生成html模板
        new htmlWebpackPlugin({
            title:"2",
            filename:"index1.html",
            template:'./src/index1.html',
            chunks:['index1','jquery'],//按需引入对应名字的js文件
            //filename:'login.html'
        }),
        // 全局暴露统一入口
        new webpack.ProvidePlugin({
            $: "jquery"
        })
    ],
    //// 提取js，lib1名字可改
    optimization: {
        splitChunks: {
            cacheGroups: {
                lib1: {
                    chunks: "initial",
                    name: "jquery",
                    enforce: true
                }
            }
        }
    }
}