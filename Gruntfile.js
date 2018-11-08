module.exports = function(grunt) {

    require("load-grunt-tasks")(grunt);
    require("time-grunt")(grunt);

    var globalConfig = {
        imagesToMinimize: "png,jpg,gif"
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        globalConfig: globalConfig,

        gitinfo: {},

        preprocess: {
            dev: {
                options: {
                    context: {
                        MODE: 'debug', // prod
                        GIT_SHORT_SHA: '<%= gitinfo.local.branch.current.shortSHA %>'
                    }
                },
                files: {
                    // add new files here
                    'index.html.tmpl': 'index.html'
                }
            },
            prod: {
                options: {
                    context: {
                        MODE: 'prod', // prod
                        GIT_SHORT_SHA: '<%= gitinfo.local.branch.current.shortSHA %>'
                    }
                },
                files: {
                    // add new files here
                    'index.html.tmpl': 'index.html'
                }
            },

        },

        copy: {
            prod: {
                src: ["*.{png,ico,txt,html,mainfest,svg,xml,manifest.json,webmanifest}", "icons/*", "css/*", "!css/vendor", "!css/generated.css*", "fonts/**/*", "images/**/*", "!images/**/*.{{<%= globalConfig.imagesToMinimize %>}}"],
                dest: "dist/"
            }
        },

        imagemin: {
            prod: {
                files: [{
                    expand: true,
                    cwd: "images",
                    src: ["**/*.{<%= globalConfig.imagesToMinimize %>}"],
                    dest: "dist/images"
                }]
            }
        },

        concat: {
            prod_js: {
                src: [
                    // add vendor files here "js/vendor/jquery.min.js" for example
                    "js/script.js"
                ],
                dest: "dist/js/generated.js",
            },
            prod_css: {
                src: [
                    "css/vendor/*.css",
                    "dist/css/generated.min.css"
                ],
                dest: "dist/css/generated.min.css",

            }
        },

        uglify: {
            options: {
                banner: "/*! DBL <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy hh:MM:ss\") %> */\n",
                mangle: false,
                compress: true,
                quoteStyle: 3
            },
            prod: {
                files: {
                    "dist/js/script.min.js": ["<%= concat.prod_js.dest %>"]
                }
            }
        },

        jshint: {
            files: ["Gruntfile.js", "js/script.js"],
            options: {
                reporter: require("jshint-stylish"),
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },

        less: {
            dev: {
                options: {
                    javascriptEnabled: true,
                    compress: false,
                    yuicompress: false,
                    optimization: 0,
                    banner: "/*! DBL <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd hh:MM:ss\") %> */",
                    sourceMap: true,
                    sourceMapFilename: "css/generated.css.map",
                    sourceMapRootpath: "../",
                    sourceMapBasepath: function() {
                        this.sourceMapURL = this.sourceMapFilename.substr(this.sourceMapFilename.lastIndexOf("/") + 1);
                    }
                },

                files: {
                    "css/generated.css": "less/style.less"
                }
            },
            prod: {
                options: {
                    javascriptEnabled: true,
                    compress: false,
                    yuicompress: false,
                    optimization: 0,
                    banner: "/*! DBL <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd hh:MM:ss\") %> */",
                    sourceMap: true,
                    sourceMapFilename: "dist/css/generated.min.css.map",
                    sourceMapRootpath: "../",
                    sourceMapBasepath: function() {
                        this.sourceMapURL = this.sourceMapFilename.substr(this.sourceMapFilename.lastIndexOf("/") + 1);
                    }
                },
                files: {
                    "dist/css/generated.min.css": "less/style.less"
                }
            }

        },

        clean: {
            dist_folder: ["dist"],
            generated_js: ["dist/js/generated.js"]
        },

        watch: {
            options: {
                nospawn: true,
                interrupt: true,
                livereload: true
            },
            styles: {
                files: ["less/**/*.less"], // which files to watch
                tasks: ["less:dev", ]
            },
            lint: {
                files: ["<%= jshint.files %>"],
                tasks: ["jshint", ]
            },
            index: {
                files: ["*.html.tmpl"],
                tasks: ["preprocess:dev"],
            }
        },

        "http-server": {
            "dev": {
                root: ".",
                port: 8000,
                host: "127.0.0.1",
                cache: 0,
                runInBackground: true
            },
            "prod": {
                root: "dist",
                port: 8000,
                host: "127.0.0.1",
                cache: 0,
            }
        },

        aws: grunt.file.readJSON('aws-keys.json'),

        aws_s3: {
            options: {
                accessKeyId: '<%= aws.AccessKeyId %>', // Use the variables
                secretAccessKey: '<%= aws.SecretKey %>', // You can also use env variables
                region: '<%= aws.Region %>',
                uploadConcurrency: 5,
                bucket: '<%= aws.Bucket %>'
            },

            deploy: {
                options: {
                    differential: true
                },
                cwd: 'dist/',
                expand: true,
                src: ['**']
            },
            cleanup: {
                files: [
                    {dest: '/', action: 'delete'},
                ]
            }
        }
    });

    grunt.registerTask("test", ["gitinfo", "jshint"]);
    grunt.registerTask("build", ["gitinfo", "preprocess:prod", "jshint", "clean:dist_folder", "copy:prod", "imagemin:prod", "less:prod", "concat:prod_js", "concat:prod_css", "uglify:prod", "clean:generated_js"]);
    grunt.registerTask("deploy", ["gitinfo", "build", "aws_s3:deploy"]);
    grunt.registerTask("cleanup", ["aws_s3:cleanup"]);
    grunt.registerTask("default", ["gitinfo", "preprocess:dev", "less:dev", "http-server:dev", "watch"]);

};