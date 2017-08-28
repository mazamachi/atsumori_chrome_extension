import gulp from 'gulp'
import gulpif from 'gulp-if'
import livereload from 'gulp-livereload'
import args from './lib/args'

gulp.task('assets', () => {
  return gulp.src('app/assets/**/*')
    .pipe(gulp.dest(`dist/${args.vendor}/assets`))
    .pipe(gulpif(args.watch, livereload()))
})
