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
          style: 'expanded',
          loadPath: ["app/styles/", "node_modules/foundation-sites/scss/", "node_modules/foundation-sites/scss/settings"]
        },
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
            'node_modules/leaflet-draw/dist/leaflet.draw.css',
            'node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.css'
          ]
        }
      }
    },
    copy: {
      images: {
        expand: true,
        flatten: true,
        src: ['node_modules/leaflet/dist/images/*.{png,gif,jpg,ico,svg}', 'node_modules/leaflet-draw/dist/images/*.{png,gif,jpg,ico,svg}'],
        dest: 'server/static/images',
        options: {
          noProcess: ['**/*.{png,gif,jpg,ico,svg}']
        }
      },
    },
    postcss: {
      options: {
          map: true,
          processors: [
              require('autoprefixer')({
                  browsers: ['last 2 versions']
              })
          ]
      },
      dist: {
          src: 'server/static/*.css'
      }
    }
});

  grunt.registerTask("default", ["eslint", "webpack:main", "sass", "postcss:dist", "cssmin:vendor", "copy:images"]);

};