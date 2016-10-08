'use strict';
const gulp = require('gulp');
const eslint = require('gulp-eslint');
var babel = require("gulp-babel");

const paths = {
  src: 'src', dst: './',
  jssrc: ['src/*.js', 'src/**/*.js']
};

gulp.task('js-eslint', _ => {
  return gulp.src(paths.jssrc)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('js-copy', _ => {
  return gulp.src(paths.jssrc)
    .pipe(babel())
    .pipe(gulp.dest(paths.dst));
});

gulp.task('js-build', ['js-eslint', 'js-copy']);

gulp.task('watch', _ => {
  gulp.watch(paths.jssrc, ['js-build']);
});

gulp.task('default', [
  'js-build',
  'watch'
]);

