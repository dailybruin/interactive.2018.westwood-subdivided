import gulp from 'gulp';

// HTML
import nunjucksRender from 'gulp-nunjucks-render';

// HTML
// import htmlmin from 'gulp-htmlmin';

// Styling related packages
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import minifyCSS from 'gulp-csso';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import replace from 'gulp-replace';

// Browsersync
import bs from 'browser-sync';
const browserSync = bs.create();
gulp.task('watch-projects', function(){
  watchDir({
      output: 'group/',
      njk: 'group/parts/**/*.html',
      html: 'group/parts/*.html'});
  });
function watchDir(project) {
  gulp.watch('src/article.njk', function() {render();});
}
function render() {
  let data = require('./data.json');
  posts('src/article.njk', 'dev/', data['data.aml']);

}
function posts(template, output, posts) {
  for (var item in posts) {
    for (var section in item) {
      data.posts = posts.posts[item];
      html(template, output, data, {basename: data.posts['filename'], extname: ".html"});
    }
  }
}
function html(template, output, thedata, name) {
  if (thedata.posts) {
    gutil.log(thedata.posts['title']);
  }
  gulp.src(template)
  .pipe(data(thedata))
  .pipe(nunjucks({path: ['group/parts/']}))
  .pipe(rename(name))
  .pipe(gulp.dest(output));
}

gulp.task('styles', () =>
  gulp
    .src('./src/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dev/css'))
    .pipe(browserSync.stream())
);

gulp.task('html', () =>
  gulp
    .src('src/*.{njk,html}')
    .pipe(
      nunjucksRender({
        path: ['src/'],
      })
    )
    .pipe(gulp.dest('dev/'))
);

gulp.task('images', () => {
  gulp.src('src/images/*').pipe(gulp.dest('dev/img'));
});

gulp.task('scripts', () =>
  gulp
    .src('src/**/*.js')
    .pipe(gulp.dest('dev/js'))
);

gulp.task('development', ['html', 'styles', 'images', 'scripts'], () => {
  browserSync.init({
    server: {
      baseDir: './dev',
      serveStaticOptions: {
        extensions: ['html'],
      },
    },
  });

  gulp.watch('src/**/*.{njk,html}', ['html']).on('change', browserSync.reload);
  gulp.watch('src/**/*.scss', ['styles']);
  gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('clean', () => del(['dev/', 'prod/']));
gulp.task('default', ['development']);
gulp.task('build', ['production']);
