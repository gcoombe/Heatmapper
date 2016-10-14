var webpackConfig = require('./webpack.config');

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.initConfig({
    webpack: {
      main: webpackConfig,

      watch: true, // use webpacks watcher
      // You need to keep the grunt process alive
      keepalive: true, // don't finish the grunt task  }
    },
    less: {
      options: {
        paths: ['app/styles/css'],
        plugins: [
          new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
          new (require('less-plugin-clean-css'))(cleanCssOptions)
        ],
        modifyVars: {
          imgPath: '"http://mycdn.com/path/to/images"',
          bgColor: 'red'
        }
      },
      files: {
        'path/to/result.css': 'path/to/source.less'
      }
    }
  });

};