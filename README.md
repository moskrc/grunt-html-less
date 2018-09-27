# Grunt HTML/LESS Boiler

** A starting point for Grunt.js HTML projects/repositories (with JsHint, ImageMin and http-server).

## Description

This repo is just an example of my preferred Grunt-powered files workflow for landing pages.

If you want to start a small project with LESS, ImageMin and JsHint - you are at the right place!

### Packages

```bash
    "grunt-contrib-imagemin"
    "grunt-contrib-uglify"
    "grunt-contrib-jshint"
    "grunt-contrib-watch"
    "grunt-contrib-less"
    "grunt-http-server"
    "jshint-stylish"
```

## Installation

Here’s a few ways to install this code:

1. Download as a [`zip`].
2. Clone it: `$ git clone https://github.com/moskrc/grunt-html-less.git`.
3. Fork it and clone: `$ git clone git@github.com:moskrc/grunt-html-less.git`.

## Setup

Install NPM dependencies

```bash
$ npm install
```

## Development preview

```bash
$ grunt
# it will compile less to css, start http-server at http://127.0.0.1:8000, and watching changes … or:
$ grunt build
# this command will build a production version on 'dist' folder or:
$ grunt test
# this command will execute jshint command only or:
$ grunt http-server:prod
# this command will start http server at http://127.0.0.1:8000 for /dist/ folder
```

## Authors

+ [Vitalii Shishorin](https://github.com/moskrc)

## License
Copyright (c) 2018 Vitalii Shishorin <moskrc@gmail.com>, contributors.
Released under the MIT license
