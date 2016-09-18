import * as gulp from 'gulp';
const runSequence = require('run-sequence');
var exec = require('child_process').exec;
import { DIST_COMPONENTS_ROOT } from '../constants';
import * as path from 'path';
const replace = require('gulp-string-replace');

// make sure the npm user is angular2-mdl-ext to publish all components
gulp.task(':dist:checknpmuser', (cb: (err?: any) => void) => {
  exec('npm whoami', (error: Error, stdout: Buffer, stderr: Buffer) => {
    if(error){
      cb(error);
    }
    const username = stdout.toString().replace(/^\s+|\s+$/g, '');
    if (username !== 'angular2-mdl-ext'){
      cb('not loged in as npm user angular2-mdl-ext');
    }
    console.log(`npm user is ${username}`);
    cb();
  });
});

gulp.task(':dist:removemoduleid', () => {
  return gulp.src(path.join(DIST_COMPONENTS_ROOT, '**/*.js'))
    .pipe(replace(/\s*moduleId:\s*module\.id\s*,?\s*/gm, ''))
    .pipe(gulp.dest(DIST_COMPONENTS_ROOT))
});

gulp.task(':dist:inlinehtml', () => {
  return gulp.src(path.join(DIST_COMPONENTS_ROOT, '**/*.js'))
    .pipe(replace(/templateUrl:\s*'([^']+?\.html)'/g, (templateUrl: string) => {
      console.log(templateUrl);
      return 'xxxxx';
    }))
    .pipe(gulp.dest(DIST_COMPONENTS_ROOT))
});

gulp.task(':dist:publish', (done: () => void) => {
  // run through each component and publish it
  done();
});

gulp.task('dist', function(done: () => void) {
  runSequence(
    'clean',
    ':dist:checknpmuser',
    [
      ':build:components:assets',
      ':build:components:scss',
      ':build:components:ts'
    ],
    ':dist:removemoduleid',
    ':dist:inlinehtml',
    ':dist:publish',
    done);
});