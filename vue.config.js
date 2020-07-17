const path = require('path');
const globalLessVariables = path.resolve(__dirname, './global.variables.less');
const resolve = (dir) => path.join(__dirname,dir);
// var postPlugins = [require('postcss-px2rem')({ remUnit: 42, })];

module.exports = {
    publicPath: process.env.NODE_ENV === 'development'? '/': './',
    filenameHashing: true,
    assetsDir: 'static',
    productionSourceMap: false,
    configureWebpack: config => {
        process.env.NODE_ENV === 'development' && (config.devtool = 'source-map');
    },
    chainWebpack:config =>{
      config.resolve.alias.set('api', resolve('src/api/api-middle-page.js'))
    },
    css: {
      loaderOptions: {
        less: {
          modifyVars: {
            hack: `true; @import "${globalLessVariables}";`
          },
        },
        // postcss: {
        //  plugins: postPlugins
        // }
      }
    },
    devServer: {
        port: 8080,
        proxy: {
            '^/api': {
                target: 'http://192.168.36.171:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '^/oa': {
              target: 'http://tm.lilanz.com/oa/api/lilanzimuser.ashx',
              changeOrigin: true,
              pathRewrite: {
                '^/oa': ''
              }
            }
        }
    }
}