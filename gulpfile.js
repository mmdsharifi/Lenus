var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    util = require('gulp-util'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    size = require('gulp-size'),
    uncss = require('gulp-uncss'),
    minifyCss = require('gulp-minify-css'),
    bower = require('gulp-bower');


var config = {
    sassPath: './resources/sass',
    bowerDir: './bower_components',
    htmlSources: '*.html'
}

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

// first load all required js files
// concat them in to  script.min.js
// and minify it.
gulp.task('js', function() {
    return gulp.src([
            config.bowerDir + '/jquery/dist/jquery.min.js',
            config.bowerDir + '/materialize/dist/js/materialize.min.js',
            './resources/js/app.js'
        ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/materialize/font/material-design-icons/*')
        .pipe(gulp.dest('./public/font/material-design-icons'));
});

gulp.task('css', function() {
    return sass(config.sassPath + '/style.scss', {
            style: 'compressed',
            loadPath: [
                './resources/sass',
                config.bowerDir + '/materialize/sass'
            ]
        })
        .on('error', util.log)
        .pipe(size())
        .pipe(uncss({
            html: ['./index.html', './posts.html'],
            timeout : 2000,
              ignore: [
                ".waves-ripple ",
                ".drag-target",
                "#sidenav-overlay",
                ".waves-effect",
                ".waves-effect .waves-ripple",
                ".waves-effect.waves-pinck .waves-ripple",
                ".waves-block.waves-light"
           ]
        }))
        .pipe(minifyCss())
        .pipe(size())
        .pipe(gulp.dest('./'))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: './',
        livereload: true
    });
});

gulp.task('html', function() {
    gulp.src(config.htmlSources)
        .pipe(connect.reload())
});

// Rerun the task when a file changes

gulp.task('watch', function() {
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    gulp.watch(config.htmlSources, ['html']);
});


gulp.task('default', ['html', 'connect', 'watch', 'bower', 'icons', 'css', 'js']);
