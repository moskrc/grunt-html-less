module.exports = function(grunt) {

	require("load-grunt-tasks")(grunt);
	require("time-grunt")(grunt);

	var globalConfig = {
		imgToMinimize: "png,jpg,gif"
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		globalConfig: globalConfig,

		clean: {
			dist_folder: ["dist"],
			generated_js: ["dist/js/generated.js"],
			generated_css: ["dist/css/style.css", "dist/css/style.css.map"]
		},

		copy: {
			prod: {
				src: ["*.{png,ico,txt,html,mainfest}", "css/**/*", "fonts/**/*", "img/**/*", "!img/**/*.{{<%= globalConfig.imgToMinimize %>}}"],
				dest: "dist/"
			}
		},

		imagemin: {
			prod: {
				files: [{
					expand: true,
					cwd: "img",
					src: ["**/*.{<%= globalConfig.imgToMinimize %>}"],
					dest: "dist/img"
				}]
			}
		},

		concat: {
			prod: {
				src: [
					"js/vendor/*.js",
					"js/script.js"
				],
				dest: "dist/js/generated.js",
			}
		},

		uglify: {
			options: {
				banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy hh:MM:ss\") %> */\n",
				mangle: false,
				compress: true,
				quoteStyle: 3
			},
			prod: {
				files: {
					"dist/js/script.min.js": ["<%= concat.prod.dest %>"]
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
			options: {
				compress: false,
				yuicompress: false,
				optimization: 0,
				banner:  "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd hh:MM:ss\") %> */",
				sourceMap: true,
				sourceMapFilename: "dist/css/style.css.map",
				sourceMapRootpath: "../",
				sourceMapBasepath: function () {
					this.sourceMapURL = this.sourceMapFilename.substr(this.sourceMapFilename.lastIndexOf("/") + 1);
				}
			},
			dev: {
				files: {
					"css/style.css": "less/main.less"
				}
			},
			prod: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2,
					sourceMapFilename: "dist/css/style.min.css.map",
				},
				files: {
					"dist/css/style.min.css": "less/main.less"
				}
			}

		},
		watch: {
			options: {
				nospawn: true,
				interrupt: true
			},
			styles: {
				files: ["less/**/*.less"], // which files to watch
				tasks: ["less", ]
			},
			lint: {
				files: ["<%= jshint.files %>"],
				tasks: ["jshint", ]
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
		}
	});

	grunt.registerTask("test", ["jshint"]);
	grunt.registerTask("build", ["jshint", "clean:dist_folder", "copy:prod", "imagemin:prod", "less:prod", "concat:prod", "uglify:prod", "clean:generated_js", "clean:generated_css"]);
	grunt.registerTask("default", ["less:dev", "http-server:dev", "watch"]);
};
