var webpackConfig = require('./webpack.config');

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-webpack');

  grunt.initConfig({
    webpack: {
      main: webpackConfig,

      watch: true, // use webpacks watcher
      // You need to keep the grunt process alive
      keepalive: true, // don't finish the grunt task  }
    }
  });

};