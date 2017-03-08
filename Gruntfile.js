/* global module:false */
module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var mozjpeg = require('imagemin-mozjpeg');
    console.log(mozjpeg);

    grunt.initConfig({

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.src/sass',
                    src: ['**/*.scss'],
                    dest: '.src/css',
                    rename: function (dest, src) {
                        var folder = src.substring(0, src.lastIndexOf('/')),
                            filename = src.substring(src.lastIndexOf('/'), src.length);
                        filename = filename.substring(0, filename.lastIndexOf('.'));
                        return dest + '/' + folder + filename + '.css';
                    }
                }],
                options: {
                    sourcemap: true,
                    style: 'nested'
                }
            }
        },

        replace: {
            dist: {
                src: ['.src/css/indiewebweek.min.css'],
                overwrite: true,
                replacements: [{
                    from: /[\t\r\n]+/g,
                    to: ''
                }, {
                    from: /<link rel="shortcut icon".*/g,
                    to: '<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/><link rel="icon" href="favicon.ico" type="image/x-icon"/>'
                }]
            }

        },

        autoprefixer: {
            options: {
                browsers: ['last 3 versions', 'ie 8']
            },
            dist: {
                expand: true,
                flatten: true,
                src: '.src/css/*.css',
                dest: '.src/css/'
            }
        },

        cssmin: {
            dist: {
                expand: true,
                cwd: '.src/css/',
                src: ['*.css', '!*.min.css'],
                dest: '.src/css/',
                ext: '.min.css'
            }
        },

        clean: {
            dist: ['.src/css/indiewebweek.css', '.src/css/indiewebweek.min.css']
        },

        'string-replace': {
            dist: {
                files: {
                    'public/index.html': '.src/html/index.html',
                },
                options: {
                    replacements: [
                        {
                            pattern: '<link href=".src/sass/indiewebweek.min.css" rel="stylesheet"/>',
                            replacement: '<style><%= grunt.file.read(".src/css/indiewebweek.min.css") %></style>'
                        }
                    ]
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'public/index.html': 'public/index.html',
                }
            },
        },

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 6,
                    svgoPlugins: [{ removeViewBox: false }]
                },
                files: [{
                    expand: true,
                    cwd: '.src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public/img/'
                }]
            }
        },

        watch: {
            sass: {
                files: '.src/sass/**/*.scss',
                tasks: ['css']
            },
            html: {
                files: '.src/html/**/*.html',
                tasks: ['html']
            },
            images: {
                files: '.src/img/**/*.{png,jpg,gif}',
                tasks: ['images']
            },
            grunt: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['css']);
    grunt.registerTask('images', ['imagemin']);
    grunt.registerTask('css', ['clean', 'sass', 'autoprefixer', 'cssmin', 'html']);
    grunt.registerTask('html', ['string-replace', 'htmlmin']);
};
