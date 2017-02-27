var gulp = require('gulp');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');
var Builder = require('systemjs-builder');
var builder = new Builder('', 'systemjs.config.js');
// var cleanCSS = require('gulp-clean-css');
// var concat = require('gulp-concat');

var bundleHash = new Date().getTime();
var mainBundleName = bundleHash + '.main.bundle.js';
var vendorBundleName = bundleHash + '.vendor.bundle.js';

// This is main task for production use
gulp.task('dist', function(done) {
  runSequence('clean', 'compile_ts', 'bundle', 'copy_assets', 'copy_common_assets',
    function() {
      done();
    }
  );
});

gulp.task('bundle', ['bundle:vendor', 'bundle:app'], function () {
  return gulp.src('index.html')
    .pipe(htmlreplace({
      'app': mainBundleName,
      'vendor': vendorBundleName
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bundle:vendor', function () {
  return builder
    .buildStatic('app/vendor.js', './dist/' + vendorBundleName)
    .catch(function (err) {
      console.log('Vendor bundle error');
      console.log(err);
    });
});

gulp.task('bundle:app', function () {
  return builder
    .buildStatic('app/main.js', './dist/' + mainBundleName)
    .catch(function (err) {
      console.log('App bundle error');
      console.log(err);
    });
});

gulp.task('compile_ts', ['clean:ts'], shell.task([
  'tsc'
]));

gulp.task('copy_assets', function() {
  return gulp.src(['./assets/**/*'], {base:"."})
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy_common_assets', function() {
  return gulp.src(['./node_modules/budgetkey-ng2-components/assets/**/*'],
                  {base:"./node_modules/budgetkey-ng2-components"})
    .pipe(gulp.dest('./dist'));
});

// gulp.task('minify-css', function() {
//   return gulp.src('./app/**/*.css')
//     .pipe(cleanCSS({compatibility: 'ie8'}))
//     .pipe(concat('styles.css'))
//     .pipe(gulp.dest('dist/'));
// });

gulp.task('clean', ['clean:ts', 'clean:dist']);

gulp.task('clean:dist', function () {
  return gulp.src(['./dist'], {read: false})
    .pipe(clean());
});

gulp.task('clean:ts', function () {
  return gulp.src(['./app/**/*.js', './app/**/*.js.map'], {read: false})
    .pipe(clean());
});