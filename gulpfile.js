var
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  preprocess = require('gulp-preprocess'),
  sass = require('gulp-sass'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  postcss = require('gulp-postcss'),
  rucksack = require('rucksack-css'),
  cssnano = require('cssnano');

var css = {
  in: 'scss/main.scss',
  watch: ['scss/**/*'],
  out: 'css/',
  sassOpts: {
    outputStyle: 'nested',
    imagePath: '../images',
    precision: 8,
    errLogToConsole: true
  },
  cssnanoOpts: {
      discardComments: {
           removeAll: false
      }
  }
}

gulp.task('clean', function() {
  del([
    'css/*'
  ]);
});

gulp.task('sass', function() {
  return gulp.src(css.in)
  .pipe(sass(css.sassOpts).on('error', sass.logError))
  .pipe(sass(css.sassOpts))
  .pipe(postcss([
    rucksack(),
    cssnano(css.cssnanoOpts)
  ]))
  .pipe(autoprefixer("last 10 version", "> 1%", "ie 8"))
  .pipe(gulp.dest(css.out));
});

gulp.task('default', ['sass'], function() {
  gulp.watch(css.watch, ['sass']);
});


