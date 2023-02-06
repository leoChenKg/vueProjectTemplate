const path = require('path')

const utils = require('./build/utils')
const { webpackCommonConfig } = require('./webpackCommonConfig')

// 旧式的webpack 配置方式
const webpackConfigure =
  process.env.NODE_ENV !== 'production'
    ? require('./build/webpack.dev.conf').dev
    : require('./build/webpack.prod.conf').prod

// 新的webpack 配置方式
// dev/prod模式均需要引入的webpack配置
const baseChain = require('./build/webpack.base.conf').baseChain

const config = require('./build/config')

// 主机及端口配置佛祖保佑
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const cliArgs = process.argv
const isBuildLib = cliArgs.indexOf('lib') >= 0
// vue/cli 配置：https://cli.vuejs.org/zh/config
/**
 * 自定义的@vue/cli配置,通过@type提供了智能提示
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // 设置public path，即上下文
  // 这个选项为.env.[development|production]文件中的VUE_APP_PUBLIC_PATH
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  indexPath: 'index.html', // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  outputDir: process.env.OUTPUT_DIR, // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。
  productionSourceMap: webpackCommonConfig.enableSourceMap.javascript,
  pages: utils.entries(),
  lintOnSave: false, // 可选值：true/false/warning/default/error
  runtimeCompiler: true, // 需要模板编译器
  transpileDependencies: true, // babel-loader 在构建时也要编译依赖的代码 node_modules
  // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
  // 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数既可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
  configureWebpack: webpackConfigure,
  // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: webpackConfig => {
   

    return webpackConfig
  },
  css: {
    extract: webpackCommonConfig.supportIE.dev || process.env.NODE_ENV === 'production', // dev:false,production:true;自动设置
    sourceMap: webpackCommonConfig.enableSourceMap.css,
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          // 主题替换
          modifyVars: {
            ...utils.theme,
            'public-path': process.env.VUE_APP_PUBLIC_PATH.endsWith('/')
              ? process.env.VUE_APP_PUBLIC_PATH
              : `${process.env.VUE_APP_PUBLIC_PATH}/`
          },
          math: 'always'
        }
      },
      postcss: {
        postcssOptions: {
          plugins: [
            require('autoprefixer')({
              // 配置使用 autoprefixer
              overrideBrowserslist: ['> 1%', 'last 3 versions', 'not ie <= 10', 'chrome >= 41'] // 记得这里要把 browsers 改为 overrideBrowserslist，autoprefixer 新版本的写法有变
            })
          ]
        }
      },
      css: {
        url: {
          filter: url => {
            // 如果url以.开始,则说明是相对路径,那么需要将它交给css-loader处理
            // return url.indexOf('.') === 0
            /**
             * 解决富文本编辑器显示异常的问题
             * houxj
             * 2022-09-30 16:57
             */
            return true
          }
        }
      }
    }
  },
  devServer: {
    hot: true,
    compress: true,
    host: HOST || '0.0.0.0',
    port: PORT || '8080',
    open: false,
    proxy: config.proxy(),
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: path.posix.join('/', '404.html') }]
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/common/less/index.less')]
    },
    i18n: {
      locale: process.env.VUE_APP_DEFAULT_LOCALE,
      fallbackLocale: 'zh_CN'
    }
  },
  configureWebpack: {
    resolveLoader: {
      modules: ['node_modules', './src/common/js/loaders']
    }
  }
}