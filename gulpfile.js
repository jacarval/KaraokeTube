var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var babel = require('babelify');

// add custom browserify options here
var customOpts = {
  entries: ['./src/js/main.jsx'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(['./src/js/main.jsx'], { debug: true }).transform(babel)); 

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public/js'));
}

// var gulp = require("gulp");
// var babel = require("gulp-babel");
// var watch = require('gulp-watch');


// gulp.task("default", function () {
//   return gulp.src("src/js/main.jsx")
//     .pipe(babel())
//     .pipe(gulp.dest("public/js"));
// });

// gulp.task('watch', function() {
//     gulp.watch('src/js/*', ['default']);
// });
