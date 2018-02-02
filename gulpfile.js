var gulp = require('gulp'),
    browserSync = require('browser-sync'),
	reload = browserSync.reload,
	del = require('del'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-csso'),
	less = require('gulp-less'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	run = require('run-sequence');

var params = {
	out: 'build',
	htmlSrc: 'index.html',
	levels: 'common.blocks'
};

gulp.task('default', [/*'server', */'build']);

gulp.task('server', function() {
	browserSync.init({
		server: params.out
	});

	gulp.watch('*.html', ['html']);
	gulp.watch('common.blocks/**/*.less', ['style']);
  gulp.watch('fonts/*.{*.woff, *.woff2}', ['rebuild']);
  gulp.watch('img/**/*', ['rebuild']);
});

gulp.task('html', function() {
	gulp.src(params.htmlSrc)
	.pipe(plumber())
	.pipe(gulp.dest(params.out))
	.pipe(reload({ stream: true }));
});

gulp.task('style', function() {
	gulp.src('style.less')
	.pipe(plumber())
	.pipe(less())
	.pipe(gulp.dest('css'))
	.pipe(cssmin())
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest(params.out))
	.pipe(reload({ stream: true }));
});

gulp.task('clean', function() {
	del('build')
});

gulp.task('copy', function() {
	return gulp.src([
		'fonts/**/*.{woff,woff2}',
		'img/**',
		'js/**'], {
			base: "."
		})
	.pipe(plumber())
	.pipe(gulp.dest('build'));
});

gulp.task('rebuild', function(done) {
	run(
		'copy',
		'style',
		'html',
		done);
});

gulp.task('build', function(done) {
	run(
		'clean',
		'copy',
		'style',
		'html',
		'server',
		done
		);
});
