const path = require('path');
const globalLessVariables = path.resolve(__dirname, './global.variables.less');
const resolve = (dir) => path.join(__dirname,dir);

module.exports = {
    publicPath: process.env.NODE_ENV === 'development'? '/': './',
    filenameHashing: true,
    assetsDir: 'static',
    productionSourceMap: false,
    outputDir: process.env.VUE_APP_OUTPUT_DIR || "dist",
    configureWebpack: config => {
        process.env.NODE_ENV === 'development' && (config.devtool = 'source-map');
    },
    chainWebpack:config =>{
      config.resolve.alias.set('api', resolve('src/api/api-middle-page.js'))
    },
    css: {
      sourceMap: process.env.NODE_ENV === 'development', 
      loaderOptions: {
        less: {
          modifyVars: {
            hack: `true; @import "${globalLessVariables}";`
          },
        }
      }
    },
    devServer: {
        port: 8080,
        proxy: {
            '^/ORCSystem': {
              target: 'http://192.168.35.136:15003/',
              changeOrigin: true,
            },
            '^/wxSystemPars.ashx':{
              target: 'http://tm.lilanz.com/oa/api',
              changeOrigin: true
            },
            '^/api': {
                target: 'http://192.168.36.171:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
         
        }
    }
}