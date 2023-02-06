const path = require('path')
// 编译期配置
const webpackCommonConfig = {
  // 代码切分配置
  /**
   * 定义:
   * 1. module: 对webpack来说,任意的一个js/png/vue文件都是一个module
   * 2. entry-point: 生成依赖图的入口,只能是j(t)s文件
   * 3. chunk: webpack内部概念,是指对依赖图中的某一些部分进行封装的结果
   * 4. bundle: 最终输出的文件,一般一个chunk对应一个bundle.
   *
   * @type {import('./build/webpack').OptimizationSplitChunksOptions}
   */
  splitChunks: {
    // 若最终生成的bundle文件大小大于这个值,则会被拆分为多个不同的bundle.(例如,在拆分echarts时,若这个值设置的比较小,则会将echarts拆分为多个js)
    maxSize: 5000000,
    // 拆分chunks的规则集.需要注意的是`priority`和`test`设置,如果配置不当,则可能生成不满足你的需求的bundle
    cacheGroups: {
      // 拆分chunk的一个规则,名称需要唯一
      vendors: {
        // 拆分的chunk生成的bundle的名称,这个名称需要与配置的入口文件的名称不同,若这里设置的名称与入口文件的名称相同,在编译期会报错.
        name: 'chunk-vendors',
        // 拆分chunk的规则,满足这个规则的任何chunk都会被生成到同一个bundle中
        test: /[\\/]node_modules[\\/]/,
        // 拆分chunk的优先级,若一个chunk可能满足多个规则,则webpack会将这个chunk生成到优先级最高的一个bundle中
        priority: 2,
        // 这个配置表示哪些chunk会被添加到这个bundle中,这里配置固定为all
        chunks: 'all',
        // 这里固定为true,表示始终为此规则创建chunk
        enforce: true,
        // 这里固定为true,表示如果此规则匹配的chunk包含的module已经由其他chunk导出,则会将其他的chunk进行引用,而不是在这个chunk中重新生成一份相同的代码
        reuseExistingChunk: true,
        // 用于覆盖全局的maxSize
        maxSize: 6000000
      },
      'face-cli-common': {
        name: 'chunk-face-cli-common',
        test: /[\\/]src[\\/](common|style)[\\/].*[\\/]\.(js|jsx|ts|tsx)]/,
        priority: 1,
        chunks: 'all',
        enforce: true,
        reuseExistingChunk: true
      },
      'face-cli-components': {
        name: 'chunk-face-cli-components',
        test: /[\\/]src[\\/]components[\\/]/,
        priority: 1,
        chunks: 'all',
        enforce: true,
        reuseExistingChunk: true
      },
      faceConfig: {
        name: 'chunk-faceConfig',
        minChunks: 1,
        test: /[\\/]faceConfig/,
        priority: 99,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      babel: {
        name: 'chunk-babel',
        minChunks: 1,
        test: /[\\/](babel|@babel)/,
        priority: 99,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      ta404: {
        name: 'chunk-ta404-modules',
        test: /[\\/]node_modules[\\/]@yh[\\/]ta404-ui[\\/]es[\\/]/,
        priority: 10,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      'ta404-dist': {
        name: 'chunk-ta404-dist',
        test: /[\\/]node_modules[\\/]@yh[\\/]ta404-ui[\\/]dist[\\/]/,
        priority: 10,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      'ta-utils': {
        name: 'chunk-ta-utils',
        test: /[\\/]node_modules[\\/]@yh[\\/]ta-utils[\\/]/,
        priority: 11,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      icons: {
        name: 'chunk-icons',
        test: /[\\/]node_modules[\\/](@yh[\\/]icons-svg)[\\/]/,
        priority: 11,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      'core-js': {
        name: 'chunk-core-js',
        test: /[\\/]node_modules[\\/]core-js[\\/]/,
        priority: 11,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      tinycolor2: {
        name: 'chunk-tinycolor2',
        test: /[\\/]node_modules[\\/]tinycolor2[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      moment: {
        name: 'chunk-moment',
        test: /[\\/]node_modules[\\/]moment[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      'ant-design': {
        name: 'chunk-ant-design',
        test: /[\\/]node_modules[\\/](@ant-design)[\\/]/,
        priority: 13,
        minChunks: 1,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      jquery: {
        name: 'chunk-jquery',
        test: /[\\/]node_modules[\\/]jquery[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      'element-ui': {
        name: 'chunk-element-ui',
        test: /[\\/]node_modules[\\/]element-ui[\\/]/,
        priority: 10,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      'wang-editor': {
        name: 'chunk-wang-editor',
        test: /[\\/]node_modules[\\/]wangeditor[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      'z-render': {
        name: 'chunk-z-render',
        test: /[\\/]node_modules[\\/]zrender[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      'vue-modules': {
        name: 'chunk-vue-modules',
        test: /[\\/]node_modules[\\/](@vue|vue|vuex|vue-grid-layout|vue-draggable-resizable-gorkys|vue-bus|axios|vue-router|vuedraggable|vue-i18n)[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      echarts: {
        name: 'chunk-echarts',
        test: /[\\/]node_modules[\\/](echarts)[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      'v-jsoneditor': {
        name: 'chunk-v-jsoneditor',
        test: /[\\/]node_modules[\\/](v-jsoneditor)[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      exceljs: {
        name: 'chunk-excel',
        test: /[\\/]node_modules[\\/](exceljs)[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      xlsx: {
        name: 'chunk-xlsx',
        test: /[\\/]node_modules[\\/](xlsx)[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      jsrsasign: {
        name: 'chunk-jsrsasign',
        test: /[\\/]node_modules[\\/](jsrsasign)[\\/]/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      },
      locale: {
        // name (module, chunks, cacheGroupKey) {
        //   const moduleFileName = module
        //     .identifier()
        //     .split('/')
        //     .reduceRight((item) => item)
        //   const allChunksNames = chunks.map((item) => item.name).join('~')
        //   return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`
        // },
        name: 'chunk-locale-json',
        test: /[a-z][a-z]_[A-Z][A-Z]\.json/,
        priority: 12,
        enforce: true,
        reuseExistingChunk: true,
        chunks: 'all'
      }
    }
  },
  // 是否需要webpack对生成的代码进行优化(修改变量名,移除空格等操作)
  minimize: true,
  supportIE: {
    // 是否在dev启动时启用IE支持
    dev: false,
    // 是否在build时启用IE支持
    build: true
  },
  // 配置babel转义代码时需要自动注入的polyfills,通过配置targets和filter来进行调整.
  polyfills: {
    // 是否启用
    enable: true,
    // 目标浏览器环境,版本号填写需要支持的最低版本
    targets: {
      ie: '11',
      chrome: '41'
    }
    // 一个正则表达式,表明只有core-js/es|web/目录下的js才会被引入
    // filter: /^(es|web)\./,
  },
  // webpack alias配置: 配置方式参考下面的默认示例.
  alias: {
    '@': 'src',
    pages: 'src/pages',
    common: 'src/common',
    '@common': 'src/common',
    '@projectCommon': 'src/projectCommon',
    faceConfig: 'faceConfig.js'
  },
  // js输出的文件:目录为dist下的路径
  jsOutputFile: 'js/[name].[fullhash:8].js',
  // css输出的文件:目录为dist下的路径
  cssOutputFile: 'css/[name].[fullhash:8].css',
  // 在webpack编译时复制到编译后的dist目录中
  copyResources: [
    {
      from: 'node_modules/@yh/ta404-ui/static', // 来源路径,相对于项目根路径的相对路径
      to: 'static', // dist目录下的路径
      toType: 'dir', // to是什么类型,dir/file/template
      type: 'common' // 复制的文件应当用于什么时期,dev/prod/common,分别代表: 开发环境/生产环境/开发以及生产环境均可用
    },
    {
      from: path.resolve(__dirname, './node_modules/wangeditor/dist/fonts/icomoon.eot'),
      to: 'fonts',
      type: 'common'
    },
    {
      from: path.resolve(__dirname, './node_modules/wangeditor/dist/fonts/icomoon.svg'),
      to: 'fonts',
      type: 'common'
    },
    {
      from: path.resolve(__dirname, './node_modules/wangeditor/dist/fonts/icomoon.ttf'),
      to: 'fonts',
      type: 'common'
    },
    {
      from: path.resolve(__dirname, './node_modules/wangeditor/dist/fonts/icomoon.woff'),
      to: 'fonts',
      type: 'common'
    }
  ],
  // 注入'process.env'的额外变量, 在build时期,将会替换process.env.***为此处设定的值.
  // 在.env文件中定义的变量,只有以VUE_APP_开头的变量才能替换运行时的process.env.***
  env: {
    VUE_APP_I18N_LOCALE: `"${process.env.VUE_APP_DEFAULT_LOCALE ? process.env.VUE_APP_DEFAULT_LOCALE : 'zh_CN'}"`,
    VUE_APP_I18N_FALLBACK_LOCALE: `"${
      process.env.VUE_APP_DEFAULT_LOCALE ? process.env.VUE_APP_DEFAULT_LOCALE : 'zh_CN'
    }"`
  },
  // 核心模块
  docModule: ['corePage/*'],
  // 框架核心模块
  coreModules: [
    'orgModules/authority',
    'orgModules/orguser',
    'systemModules/sysmg',
    'systemModules/resourcemg',
    'systemModules/messagemg',
    'systemModules/logmg',
    'functionModules',
    'auditModules/audit',
    'workTable/workTablePage',
    // 'onlineForm',
    // 'onlineDev',
    'projectDemo'
  ],
  // 项目新增模块
  projectModules: [
    'base',
    // 'gsp',
    // 'vip',
    'drug',
    'purc',
    // 'hi',
    'sale',
    // 'report',
    'inv',
    // 'fin',
    'query'
  ],
  locale: {
    // moment默认提取en及下列国际化文本,在修改值时,需要到node_modules/moment/locale下确认文件名称
    // 只有在这里配置了的语言(默认包括en),在生产环境打包时,才会打包到最终的js文件中
    moment: /zh-cn/
  },
  enableSourceMap: {
    javascript: process.env.NODE_ENV === 'development',
    css: false
  },
  lib: {
    filename: 'index'
  }
}

module.exports = { webpackCommonConfig }
