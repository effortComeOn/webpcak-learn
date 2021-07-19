### webpack

- 基础篇： 掌握 webpack 的核心概念和开发必备技巧
- 进阶篇： 编写 webpack 的构建配置并掌握优化策略
- 原理篇： 剖析内部运行原理并编写自定义 Loader 和插件
- 实战篇： 通过 webpack 商城项目实战牢固掌握所学知识

#### 为什么需要构建工具

1. 转换 ES6 语法
2. 转换 JSX
3. css 前缀补全/预处理器
4. 压缩混淆
5. 图片压缩

#### 为什么选择 webpack？

- 社区生态丰富
- 配置灵活和插件化扩展
- 官方更新迭代速度快

#### webpack 核心概念：

1. entry
   单个入口为字符串，多入口为对象
2. output
   单入口可固定文件输出名，多入口，用[name]占位符
3. loaders
   - webpack 开箱即用只支持 JS 和 JSON 两种文件类型，通过 Loaders 去支持其它文件类型并且把他们转换成有效的模块，并且可以添加到依赖图中。
   - 本身是哥函数，接受源文件作为参数，返回转换结果
4. Plugins
   插件用于 bundle 文件的优化，资源管理和环境变量注入，作用域整个构建过程
5. Mode
   用来制定当前的构建环境，production，development，none

#### 文件指纹：可以用作版本管理

1. Hash： 和整个项目构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
2. Chunkhash： 和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值
3. Contenthash： 根据文件内容来定义 hash， 文件内容不变，则 contenthash 不变

#### 文件压缩 webpack plugins

1. js 文件压缩，内置 uglifyjs-webpack-plugin
2. css 文件压缩，
   - webpack4 optimize-css-assets-webpack-plugin， cssnano 预处理器
   - webpack5 css-minimizer-webpack-plugin
3. html 文件压缩， html-webpack-plugin，设置压缩参数

#### 清除文件目录

1. webpack 4 ，使用 clean-webpack-plugin 进行清除
2. webpack 5 , 使用 output 的 clean: true, 即可清除打包的 dist 目录

#### css 样式前缀补全

1. 查询 css 属性浏览器的支持情况，通过 can i use 网站，查看浏览器兼容性
2. 通过 postcss-loader 配置样式补全。

```js
{
    loader: "postcss-loader",
    options: {
      postcssOptions: {
      // postcss-preset-env 中包含 autoprefixer 配置， browerlists 放在了 package.json 中
      plugins: [["postcss-preset-env"]],
      },
    },
  },
```

package.json 中

```js
{
    "browserslist": [
    "last 1 version",
    "> 1%",
    "ios 7"
  ]
}

```

#### 移动端 css px 自动转换成 rem

1. px2rem-loader
2. lib-flexible

#### 资源内联

1. 代码层面
   - 页面框架的初始化脚本
   - 上报相关打点
   - css 内联，避免页面闪动
2. 请求层面
   - 减少 http 网络请求数
   - 小图片或者字体内联 （url-loader）

使用 row-loader 内联 html 和 js

css 内联
- 借助 style-loader
- html-inline-css-webpack-plugin

