module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
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
    }
  });

  grunt.event.on('watch', function(action, filepath) {
      grunt.config(['jshint', 'all'], [filepath]);
  });
}

