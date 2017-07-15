var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    uglifycss = require('gulp-uglifycss'),
    uglifyjs = require('gulp-uglifyjs'),
    concat = require('gulp-concat'),
    bourbon = require('node-bourbon'),
    browserSync = require('browser-sync').create(),
    path = require("path"),
    html = require('gulp-processhtml'),
    watch = require('gulp-watch'),
    runs = require('run-sequence'),
    clean = require('gulp-clean'),
    injectPartials = require('gulp-file-include'),
    uncss = require('gulp-uncss');

var targetPath = "../Public";

var paths = {
    sass:
        [	
        	//VENDOR
            path.join(__dirname, "sass/*bootstrap*/_bootstrap.scss"),

            //PLUGINS
            path.join(__dirname, "bower_components/jcf/dist/css/theme-minimal/jcf.css"),
            //path.join(__dirname, "bower_components/jcf/dist/css/demo.css"),
            path.join(__dirname, "bower_components/slick-carousel/slick/slick.css"),
            path.join(__dirname, "bower_components/slick-carousel/slick/slick-theme.css"),
            // FONT AWESOME CSS
            path.join(__dirname, "bower_components/font-awesome/css/font-awesome.css"),
            path.join(__dirname, "plugins/**/*.css"),

            //CUSTOM
            path.join(__dirname, 'sass/*.scss'),
            path.join(__dirname, 'sass/*pages*/*.scss')
        ],      
    js: [
    		//VENDOR
            //path.join(__dirname, "bower_components/javascript/defer_parsing.js"),
            path.join(__dirname, "bower_components/jquery/dist/jquery.min.js"),
            path.join(__dirname, "bower_components/bootstrap/dist/js/bootstrap.min.js"),

            //PLUGINS
            path.join(__dirname, "bower_components/jcf/dist/js/jcf.js"),
            path.join(__dirname, "bower_components/jcf/dist/js/jcf.radio.js"),
            path.join(__dirname, "bower_components/jcf/dist/js/jcf.checkbox.js"),
            path.join(__dirname, "bower_components/jcf/dist/js/jcf.select.js"),
            path.join(__dirname, "bower_components/slick-carousel/slick/slick.min.js"),

            path.join(__dirname, "plugins/**/*.js"),

            //APP
            path.join(__dirname, 'script/*.js'),
            path.join(__dirname, 'script/*Includes*/*.js')
    ]	
}

// --------------------------------------------------------- INIT TASK //

gulp.task('init', ['sass', 'js']);

// --------------------------------------------------------- SET TASK FOR WATCHER //


// CLEANER
gulp.task('clean-sass', function (file) {
  return gulp.src([
        path.join(__dirname, targetPath + '/assets/css/style.min.css'), 
        path.join(__dirname, targetPath + '/assets/css/maps/style.min.css.map'), 
        ], {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-js', function () {
  return gulp.src(path.join(__dirname, targetPath + '/assets/js/app.min.js'), {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-csspages', function () {
  return gulp.src(path.join(__dirname, targetPath + '/assets/css/pages/*.css'), {read: false})
    .pipe(clean({force: true}));
});
// CLEANER

// copy HTML task
gulp.task('html', function() {
    return gulp.src(path.join(__dirname, "views/pages/*.html"))
        //.pipe(html())
        .pipe(injectPartials({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest(path.join(__dirname, targetPath)))
        .pipe(browserSync.stream())
});

// copy the sass file task
gulp.task('sass', ['clean-sass'], function() {
    return gulp.src([
    		//VENDOR
            //'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'sass/*bootstrap*/_bootstrap.scss',

            //PLUGINS
            'bower_components/jcf/dist/css/theme-minimal/jcf.css',
            //"bower_components/jcf/dist/css/demo.css,
            'bower_components/slick-carousel/slick/slick.css',
            'bower_components/slick-carousel/slick/slick-theme.css',
            // FONT AWESOME CSS
            'bower_components/font-awesome/css/font-awesome.css',
            'plugins/**/*.css',

            //CUSTOM
            'sass/*.scss'
    	])
        .pipe(concat('style.min.css'))
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer({ browsers: ['> 0%'] })]))       
        //.pipe(uglifycss())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/css/')))
        .pipe(browserSync.stream());
});

// copy javascript task
gulp.task('js', ['clean-js'], function () {
    return gulp.src([
    		//VENDOR
            //'bower_components/javascript/defer_parsing.js',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',

            //PLUGINS
            'bower_components/jcf/dist/js/jcf.js',
            'bower_components/jcf/dist/js/jcf.radio.js',
            'bower_components/jcf/dist/js/jcf.checkbox.js',
            'bower_components/jcf/dist/js/jcf.select.js',
            'bower_components/slick-carousel/slick/slick.min.js',
            'plugins/**/*.js',

            //APP
            'script/*.js',
            'script/*Includes*/*.js'
    	])
        .pipe(concat('app.min.js'))
        .pipe(uglifyjs())
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/js/')))
        //.pipe(browserSync.stream()); //uncomment to browser sync after js updated
});

// --------------------------------------------------------- SET SHOW WATCHER //

//Watcher active
gulp.task('watch', function(){
    watch(path.join(__dirname, "sass/**/*.scss"), function() { runs('sass'); });
    watch(paths.sass, function() { runs('sass'); });
    watch(paths.js, function() { runs('js'); });  
});

// --------------------------------------------------------- SHOW WATCHER //

gulp.task('default', ['init', 'html', 'watch'], function(){

    browserSync.init({
        server: {
            baseDir: [path.join(__dirname, targetPath)]
        }
    });
    watch(path.join(__dirname, "views/**/*.html"), function() {
        runs('html');
    });
});

gulp.task('development', ['init', 'watch']);


//------ TESTING ------//


//UNCSS
gulp.task('uncss', function () {
    return gulp.src([
            //CUSTOM
            'sass/*.scss'
        ])
        .pipe(concat('uncss.css'))
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(uncss({
            html: [path.join(__dirname, targetPath + '/*.html')],
            ignore: ['/active/', '/before/', 'after']
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('../Public/assets/css/uncss/'));
});