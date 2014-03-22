module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      sass: {
        files: 'public/scss/*.scss',
        tasks: ['compass']
      },

      scripts: {
        files: ['app/**/*.js', 'public/**/*.js'],
        tasks: ['jshint']
      },

      options: {
        nospawn: true
      }
    },

    jshint: {
      all: ['<%= watch.scripts.files %>'],
      options: grunt.file.readJSON('.jshintrc')
    },

    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    }
  });

  grunt.event.on('watch', function(action, filepath) {
      grunt.config(['jshint', 'all'], [filepath]);
  });
}

