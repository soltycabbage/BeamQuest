module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            sass: {
                files: 'public/scss/*.scss',
                tasks: ['compass']
            },

            frontScripts: {
                files: ['public/**/*.js'],
                tasks: ['jshint']
            },

            backScripts: {
                files: ['app/beamQuest/**/*.ts'],
                tasks: ['ts:build']
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
                src: ['target/**/*Spec.js']
            }
        },

        ts: {
            build: {
                src: ['app/beamQuest/**/*.ts'],
                outDir: 'target/beamQuest/',
                target: 'es5',
                options: {
                    module: 'commonjs'
                }
            },
            watch: {
                src: ['app/beamQuest/**/*.ts'],
                outDir: 'target/beamQuest/',
                target: 'es5',
                options: {
                    module: 'commonjs'
                },
                watch: 'app/beamQuest/'
            },
        },

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: [
                        'beamQuest/**/*.js',
                        'beamQuestBackend/**/*'
                    ],
                    dest: 'target/',
                    filter: 'isFile'
                }]
            }
        }
    });

    grunt.registerTask('build', ['ts:build', 'copy']);
    grunt.registerTask('test', ['build', 'jshint', 'mochaTest']);
};
