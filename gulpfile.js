'use strict';
const gulp = require('gulp');
const csslint = require('gulp-csslint');
const htmlhint = require("gulp-htmlhint");
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const connect = require('gulp-connect');
const jsdoc = require('gulp-jsdoc3');

const paths = {
  src: 'src', dst: './',
  css:   ['demo/*.css', 'demo/**/*.css',
          'test/*.css', 'test/**/*.css',
          'src/*.css',   'src/**/*.css'],
  html:  ['demo/*.html', 'demo/**/*.html',
          'test/*.html', 'test/**/*.html'],
  js:    ['demo/*.js',   'demo/**/*.js',
          'test/*.js',   'test/**/*.js',
          'src/*.js',    'src/**/*.js'],
  csssrc:['src/*.css',   'src/**/*.css'],
  jssrc: ['src/*.js',    'src/**/*.js']
};

gulp.task('reload', function () {
  return gulp.src(paths.js, { read: false })
    .pipe(connect.reload());
});

gulp.task('doc', function () {
  var config = require('./.jsdoc.json');
  return gulp.src(['./README.md'].concat(paths.jssrc), { read: false })
    .pipe(jsdoc(config));
});

gulp.task('css-lint', function() {
  return gulp.src(paths.css)
    .pipe(csslint())
    .pipe(csslint.formatter());
});

gulp.task('html-hint', _ => {
  return gulp.src(paths.html)
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());
});

gulp.task('js-lint', _ => {
  return gulp.src(paths.jssrc)
    .pipe(jshint())
    .pipe(jscs())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jscs.reporter());
});

gulp.task('js-copy', _ => {
  return gulp.src(paths.jssrc)
    .pipe(babel())
    .pipe(gulp.dest(paths.dst));
});

gulp.task('css-copy', _ => {
  return gulp.src(paths.csssrc)
    .pipe(gulp.dest(paths.dst));
});

gulp.task('watch', _ => {
  gulp.watch(paths.js, ['reload']);
  gulp.watch(paths.html, ['html-hint', 'doc', 'reload']);
  gulp.watch(paths.jssrc, ['js-lint', 'js-copy', 'doc', 'reload']);
  gulp.watch(paths.csssrc, ['css-lint', 'css-copy', 'reload']);
});

gulp.task('connect', function() {
  connect.server({
    root: paths.dst,
    livereload: true,
    port: 9001
  });
});

gulp.task('default', [
  'js-lint',
  'css-lint',
  'html-hint',
  'css-copy',
  'js-copy',
  'doc',
  'watch',
  'connect'
]);

