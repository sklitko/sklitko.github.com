var syntax = 'scss' // Syntax: sass or scss;

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  browsersync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cleancss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  notify = require('gulp-notify'),
  rsync = require('gulp-rsync'),
  tinypng = require('gulp-tinypng'),
  del = require('del'),
  webp = require('gulp-webp')

gulp.task('browser-sync', function() {
  browsersync({
    server: {
      baseDir: 'app'
    },
    notify: false,
    // open: false,
    tunnel: false
    // tunnel: 'kawa' //Demonstration page: http://kawa.localtunnel.me
  })
})

gulp.task('styles', function() {
  return gulp
    .src('app/' + syntax + '/**/*.' + syntax + '')
    .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest('app/css'))
    .pipe(browsersync.reload({ stream: true }))
})

gulp.task('js', function() {
  return gulp
    .src([
      'app/js/language.js',
      'app/js/common.js' // Always at the end
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify()) // Mifify js (opt.)
    .pipe(gulp.dest('app/js'))
    .pipe(browsersync.reload({ stream: true }))
})

gulp.task('rsync', function() {
  return gulp.src('app/**').pipe(
    rsync({
      root: 'app/',
      hostname: 'username@yousite.com',
      destination: 'yousite/public_html/',
      // include: ['*.htaccess'], // Includes files to deploy
      exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
      recursive: true,
      archive: true,
      silent: false,
      compress: true
    })
  )
})

gulp.task('watch', ['styles', 'js', 'browser-sync'], function() {
  gulp.watch('app/' + syntax + '/**/*.' + syntax + '', ['styles'])
  gulp.watch(['libs/**/*.js', 'app/js/language.js', 'app/js/common.js'], ['js'])
  gulp.watch('app/*.html', browsersync.reload)
})

gulp.task('tinypng', function() {
  gulp
    .src('app/**/*.png')
    .pipe(tinypng('wGkSUQdaVFB9IChbbPnVYLLSw8GGOJBU'))
    .pipe(gulp.dest('dist_img'))
})

gulp.task('webp', function() {
  gulp.src('app/**/*.webp').pipe(gulp.dest('dist'))
})

gulp.task('default', ['watch'])

gulp.task('build', ['removedist', 'styles', 'js'], function() {
  var buildFiles = gulp
    .src(['app/*.html', 'app/.htaccess'])
    .pipe(gulp.dest('dist'))

  var buildCss = gulp.src(['app/css/*']).pipe(gulp.dest('dist/css'))

  var buildJs = gulp.src(['app/js/scripts.min.js']).pipe(gulp.dest('dist/js'))
  var buildJsLib = gulp.src(['app/libs/**/*']).pipe(gulp.dest('dist/libs'))
  var buildImg = gulp.src(['dist_img/**/*']).pipe(gulp.dest('dist'))
  var buildFonts = gulp.src(['app/fonts/**/*']).pipe(gulp.dest('dist/fonts'))
})

gulp.task('removedist', function() {
  return del.sync('dist')
})

gulp.task('webpp', () =>
  gulp
    .src('app/**/*.png')
    .pipe(webp())
    .pipe(gulp.dest('dist'))
)
