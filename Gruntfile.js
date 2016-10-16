var webpackConfig = require('./webpack.config');
var _ = require('lodash');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

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
    },
    eslint: {
      target: ['app/scripts/**']
    }
  });

  grunt.registerTask("default", ["eslint", "webpack", "sass"]);

};