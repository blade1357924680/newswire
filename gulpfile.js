'use strict';
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    htmlmin = require('gulp-htmlmin'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass')(require('sass')),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    browsersync = require('browser-sync'),
    reload = browsersync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        style: 'build/css/',
        img: 'build/img/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/style/main.scss',
        img: 'src/img/*',
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/*'
    }
};

gulp.task("webserver", function () {
    browsersync.init({
        server: {
            baseDir: "./build"
        },
        host: 'localhost',
        port: 3000,
        //tunnel: true
    });
});

gulp.task("html:build", function (done) {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
    done();
});

gulp.task("js:build", function (done) {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
    done();
})

gulp.task("style:build", function (done) {
    gulp.src(path.src.style)
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.style))
        .pipe(reload({stream: true}));
    done();
})

gulp.task("img:build", function (done) {
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
    done();
})

gulp.task('build', gulp.parallel('html:build', 'js:build', 'style:build', 'img:build'));

gulp.task('watch', function () {
    watch([path.watch.js], gulp.parallel('js:build'));
    watch([path.watch.html], gulp.parallel('html:build'));
    watch([path.watch.style], gulp.parallel('style:build'));
    watch([path.watch.style], gulp.parallel('img:build'));
});

gulp.task('default', gulp.parallel('build', 'webserver', 'watch'));

