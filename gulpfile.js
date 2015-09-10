var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    util = require('gulp-util'),
    connect = require('gulp-connect'),
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

gulp.task('js', function() {
    return gulp.src([config.bowerDir + '/materialize/dist/js/materialize.min.js',
            config.bowerDir + '/jquery/dist/jquery.min.js'
        ])
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
        .pipe(gulp.dest('./public/css'))
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
