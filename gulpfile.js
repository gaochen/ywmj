"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("test", function() {
    return gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('static/css'));
});

//终端gulp test-watch，动态实时监控
gulp.task('test-watch', function() {
    gulp.watch('sass/**/*.scss', ['test']);
});