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

#### source map

使用 devtool 配置，不同的配置，打包后是不同的形式。

- eval: 使用 eval 包裹模块代码
- source map： 产生 .map 文件
- cheap: 不包含列信息
- inline: 将 .map 作为 DataURI 嵌入，不单独生成 .map 文件
- module: 包含 loader 的 sourcemap

#### 基础库分离

方法 1:

- 思路： 将 react、react-dom 基础包通过 cdn 引入，不打入 bundle 中
- 方法： 使用 html-webpack-externals-plugin

```js
new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: "react",
      entry: "https://unpkg.com/react@17/umd/react.development.js",
      global: "React",
    },
    {
      module: "react-dom",
      entry: "https://unpkg.com/react-dom@17/umd/react-dom.development.js",
      global: "ReactDOM",
    },
  ],
});
```

方法 2:

利用 SplitChunksPlugin 进行公共脚本分离

webpack 4 内置的， 替代 CommonsChunkPlugin 插件。chunks 参数说明：

- async 异步引入的库进行分离（默认）
- initial 同步引入库进行分离
- all 所有引入的库进行分离 （推荐）

```js
optimization: {
    // 代码分割
    splitChunks: {
        cacheGroups: {
            commons: {
                test: /(react|react-dom)/,
                name: "vendors",
                chunks: "all",
            },
        },
    },
},
```

提取公共文件：

```js
splitChunks: {
    minSize: 0,
    cacheGroups: {
        commons: {
            name: "commons",
            chunks: "all",
            minChunks: 1,
        },
    },
},
```

#### tree shaking

##### 概念

一个模块可能有多个方法，只要其中某个方法被使用，则整个文件都会被打包到 bundle 中去， tree shaking 就是只把用到的方法打入到 bundle，没用到的方法会在 uglify 阶段被擦除。

##### 使用

webpack 默认支持，在 .babelrc 里设置 modules: false

mode 为 production 时， 默认开启 tree shaking

##### 要求

必须是 ES6 的语法，CJS 的方式不支持。

##### DCE （Elimination）

- 代码不会被执行，不可到达
- 代码执行结果不会被用到
- 代码只会影响死变量 （只写不读）

##### tree-shaking 的原理

1. 利用 ES6 模块的特点

   - 只能作为模块顶层的语句出现
   - import 的模块名只能是字符串常量
   - import binding 是 immutable 的

2. 代码擦除
   - uglify 阶段删除无用代码

#### ScopeHoisting 使用和原理分析

原理： 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突。

结合 webpack 打包后的文件来分析

不开启 ScopeHoisting 时，构建后的代码存在大量闭包，会存在一些问题

- 大量函数闭包包裹代码，导致代码体积增大（模块越多越明显）
- 运行代码时创建的函数作用域变多，内存开销变大

而通过 scope hoisting 可以减少函数生命代码和内存开销

mode 为 production 时，默认开启。必须是 ES6 语法；CJS 不支持,如果动态引入模块时，无法静态分析模块。

手动开启方式：

```js
{
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()];
}
```
