var gulp   = require( 'gulp' ),
    server = require( 'gulp-develop-server' )
    jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src([
    './routes/*.js',
    './app.js',
    './models/*.js'
  ]).pipe(jshint())
    .pipe(jshint.reporter('default'));
});

    // run server
gulp.task( 'server:start', function() {
    server.listen( { path: './bin/www' } );
});

// restart server if app.js changed
gulp.task( 'server:restart', function() {
    gulp.watch( [ './bin/www' ], server.restart );
});

gulp.task('default', ['lint','server:start','server:restart']);
