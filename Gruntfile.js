var webpackConfig = require('./webpack.config');
var _ = require('lodash');

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.initConfig({
    webpack: {
      main: webpackConfig,
      dev: _.extend({}, webpackConfig, {
        watch: true,
        keepalive: true
      })
    },
    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        loadPath: "app/styles",
        files: {
          'server/static/main.css': 'app/styles/main.scss'
        }
      }
    }
  });

  grunt.registerTask("default", ["webpack", "less"]);

};