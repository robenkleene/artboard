// devDependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// Built-in
var path = require('path');

// Base Paths
var basePaths = {
  dist: './dist',
  examples: './examples'
};

// Paths
var paths = {
  dist: {
    src: basePaths.dist,
    dest: basePaths.dist
  },
  examples: {
    src: path.join(basePaths.examples, 'src'),
    dest: path.join(basePaths.examples, 'dest')
  }
};

// Languages
paths.html.examples = basePaths.examples;
paths.sass = {
  dist: {
    src: paths.src,
    dest: paths.dest
  }, examples: {
    src: path.join(paths.examples.src, "sass"),
    dest: path.join(paths.examples.dest, "css")
  }
};

// Globs
var globs = {
  sass: {
    dist: {
      src: path.join(paths.dist.sass.src, '**/*.scss')
    },
    examples: {
      src: path.join(paths.examples.sass.src, '**/*.scss')
    }
  },
  html: {
    dest: path.join(paths.examples.html, "*.html")
  }
};

// Helper

function buildSass(src, dest) {
  return gulp.src(globs.sass.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(browserSync.stream());
}

// Tasts

gulp.task('sass-dist', function () {
  buildSass(globs.sass.dist.src, paths.sass.dist.dest);
});

gulp.task('sass-examples', function () {
  buildSass(globs.sass.examples.src, paths.sass.examples.dest);
});

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: paths.html.examples
    });
    gulp.watch([globs.sass.examples.src, globs.sass.dist.src], ['sass-examples']);
    gulp.watch(globs.html.examples)
      .on('change', browserSync.reload);
});

gulp.task('watch', ['sass'], function () {
  gulp.watch([globs.sass.examples.src, globs.sass.dist.src], ['sass-examples']);
  gulp.watch(globs.sass.dist.src, ['sass-dist']);
});

gulp.task('sass', ['sass-dist', 'sass-examples']);
gulp.task('default', ['sass']);
