'use strict';

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        mavenEffectivePom : {
            main : {
                options : {
                    file : "target/effective-pom.xml",
                    varName : 'pom'
                }
            }
        },

        config : {
            srcFolder : 'src/main/javascript',
            testFolder : 'src/test/javascript',
            webappFolder : 'src/main/webapp',
            appFolder : '<%= pom.project.build.directory %>/<%= pom.project.build.finalName %>/app',
            destSrcFolder : '<%= config.appFolder %>/js',
            bowlerLib : 'target/<%= pom.project.build.finalName %>/app/lib'
        },

        "bower-install-simple": {
            options: {
                color: true,
                directory: '<%= config.bowlerLib %>'
            },
            "prod": {
                options: {
                    production: true
                }
            },
            "dev": {
                options: {
                    production: false
                }
            }
        },

        jshint: {
            all: ['Gruntfile.js', '<%= config.bowlerLib %>/**/*.js', '<%= config.srcFolder %>/**/*.js']
        },

        copy: {
            main: {
                files: [
                    {expand: true, src: ['<%= config.srcFolder %>/**/*.js'], dest: '<%= config.destSrcFolder %>', filter: 'isFile', flatten: true}
                ]
            }
        },

        concat: {
            options: {
                separator: ';',
                banner: "'use strict';\n",
                process: function(src, filepath) {
                    var res = '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');

                    return res.replace(/\$\{baseurl\}/g, grunt.config('pom.properties.baseurl'));
                }
            },
            dist: {
                src: ['<%= config.srcFolder %>/**/*.js'],
                dest: '<%= config.destSrcFolder %>/<%= pkg.name %>.js'
            }
        },

        uglify: {
            build: {
                src: '<%= config.destSrcFolder %>/<%= pkg.name %>.js',
                dest: '<%= config.destSrcFolder %>/<%= pkg.name %>.js'
            }
        },

        includeSource: {
            options: {
                basePath: '<%= config.appFolder %>',
                baseUrl: ''
            },
            myTarget: {
                files: [{src : '<%= config.webappFolder %>/app/index.tpl.html', dest: '<%= config.appFolder %>/index.html'}]
            }
        },

        wiredep: {

            task: {
                src: [
                   '<%= config.appFolder %>/index.html'
                ],
                options: {
                    directory : '<%= config.bowlerLib %>'
                }
            }
        },

        karma: {
            options: {
                files:[
                    '<%= config.bowlerLib %>/**/*.min.js',
                    '<%= config.srcFolder %>/**/*.js'
                ],
                browsers: ['Chrome'],
                port: 9876
            },
            unit: {
                basePath: '',
                files: [
                    { src: ['<%= config.testFolder %>/**/*.js'] }
                ],
                frameworks: ['jasmine'],
                exclude: [ ],
                preprocessors: { },
                reporters: ['progress'],
                colors: true,
                // level of logging
                // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
                logLevel: config.LOG_INFO,
                // enable / disable watching file and executing tests whenever any file changes
                autoWatch: true,
                // Continuous Integration mode
                // if true, Karma captures browsers, runs the tests and exits
                singleRun: true
            }
        },

        watch: {
            files: ['<%= config.srcFolder %>/**/*.js'],
            tasks: ['concat']
        }

    });

    grunt.registerTask('dev', ['mavenEffectivePom','bower-install-simple:dev', 'copy','includeSource','wiredep']);
    grunt.registerTask('default', ['mavenEffectivePom','bower-install-simple:prod',/*'jshint',*/'concat',/*'uglify',*/'includeSource','wiredep']);

};