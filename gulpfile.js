var gulp = require('gulp');

var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var header = require('gulp-header');
var strftime = require('strftime');
var prefix = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');


// 自定義時間
var date = strftime('%F %T');
var banner = ['/**', ' * mod date <%= date %>', ' */', ''].join('\n');




//// LESS 2 CSS ////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('less_ryu', function () {
    gulp.src(['themes/ryu/_source/less/style.less'])
        .pipe(less())
        .pipe(prefix())
        .pipe(minifyCSS({
            noAdvanced: true
        }))
        .pipe(header(banner, {
            date: date
        }))
        .pipe(gulp.dest('themes/ryu/assets/css'))
        .pipe(livereload());
});




//// JS ////////////////////////////////////////////////////////////////////////////////////////////////////////
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('js_ryu', function () {
    gulp.src([
        "themes/ryu/_source/js/*"
    ])
        .pipe(concat('aqq.js'))
        .pipe(uglify())
        .pipe(header(banner, {
            date: date
        }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('themes/ryu/assets/js'));
});




//// 監控 //////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('watching', function () {

    gulp.watch('themes/ryu/_source/less/*.less', ['less_ryu']);
    gulp.watch('themes/ryu/_source/js/*.js', ['js_ryu']);

    var server = livereload();
    gulp.watch('themes/ryu/**/*').on('change', function (file) {
        server.changed(file.path);
    });

});




//// 執行 //////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('default', [
    'less_ryu',
    'js_ryu',
    'watching'
]);