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
    },
    cssmin: {
      vendor: {
        files: {
          'server/static/vendor.css': [
            'node_modules/leaflet/dist/leaflet.css',
            'node_modules/leaflet/dist/leaflet.draw.css'
          ]
        }
      }
    }
});

  grunt.registerTask("default", ["eslint", "webpack:main", "sass", "cssmin:vendor"]);

};