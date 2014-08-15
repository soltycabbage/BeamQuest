module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            sass: {
                files: 'public/scss/*.scss',
                tasks: ['compass']
            },

            backScripts: {
                files: ['public/**/*.js'],
                tasks: ['jshint']
            },

            frontScripts: {
                files: ['public/**/*.js'],
                tasks: ['jshint']
            },

            options: {
                nospawn: true
            }
        },

        jshint: {
            all: ['<%= watch.frontScripts.files %>'],
            options: grunt.file.readJSON('.jshintrc')
        },

        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['app/**/*Spec.js']
            }
        }
    });

    grunt.registerTask('test', ['jshint', 'mochaTest']);
};
