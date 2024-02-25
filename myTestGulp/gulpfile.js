// Подключение скаченных плагинов(модулей) из packaje.json
const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const ts = require('gulp-typescript')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size')
const gulppug = require('gulp-pug')
const newer = require('gulp-newer')
const browsersync = require('browser-sync').create()
const del = require('del')

// Пути к нашим изначальным файлам
//* следит за всеми файлами в каталоге, а ** следят за всеми вложенными каталогами и файлами в каталоге
const paths = {
  pug: {
    src: 'src/*.pug',
    dest: 'dist/'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: ['src/styles/**/*.sass', 'src/styles/**/*.scss'],
    dest: 'dist/css/'
  },
  scripts: {
    src: ['src/scripts/**/*.ts', 'src/scripts/**/*.js'],
    dest: 'dist/js'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img'
  }
}

// del для удаления и очистки каталогов в dist ранее собранных
// исключили каталог img, что бы сжатие выполнялось только новых картинок
function clean() {
  return del(['dist/*', '!dist/img'])
}

// плагин pug для быстрого написания html разметки
function pug() {
  return gulp.src(paths.pug.src)
    .pipe(gulppug())
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browsersync.stream())
}

// простой плагин для сжатия html так же в html,css,scripts функции
//подключен плагин gulp-size который во время сборки показывает размер файлов
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
}

//Задача для обработки скриптов
// babel и babel/core переводят новый js в старый, для поддержки в старых браузерах
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(ts({
      noImplicitAny: true,
      outFile: 'main.min.js'
    }))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
}

// сжимает все изображения формата .jpg
// newer при сборке, если изображения уже есть в финальной сборке, то заново
// сжимать их не будет, только новые
function img() {
  return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.images.dest))
}

// watch после сборки следит за всеми изменениями в реальном времени, прерывается командой ctrl + C
// browsersync следит за каталогом и при изменениях в html обновляет страницу
function watch() {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
}

// сборка выполняет задачи поочереди и параллельно
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)

exports.clean = clean
exports.img = img
exports.pug = pug
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build
