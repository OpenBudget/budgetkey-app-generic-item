'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

gulp.task('default', function(done) {
  runSequence('clean', 'assets', done);
});

gulp.task('assets', ['assets:app', 'assets:vendor']);

gulp.task('assets:app', function() {
  return gulp.src([
    './assets/**/*',
    './favicon.ico'
  ], {
    base: '.'
  })
    .pipe(gulp.dest('./dist'));
});

gulp.task('assets:vendor', function() {
  return gulp.src([
    './node_modules/budgetkey-ng2-components/assets/**/*'
  ], {
    base: './node_modules/budgetkey-ng2-components'
  }).pipe(gulp.dest('./dist'));
});

gulp.task('clean', ['clean:dist', 'clean:ts']);

gulp.task('clean:dist', function () {
  return gulp.src([
    './dist'
  ], {
    read: false
  }).pipe(clean());
});

gulp.task('clean:ts', function () {
  return gulp.src([
    './app/**/*.js',
    './app/**/*.js.map',
    './e2e/**/*.js',
    './e2e/**/*.js.map',
    './karma-test-shim.js',
    './karma-test-shim.js.map'
  ], {
    read: false
  }).pipe(clean());
});
