import { task } from 'gulp';
import * as gulp from 'gulp';


const gulpClean = require('gulp-clean');

task('clean', [], (done:any) => {
    return gulp.src('dist', { read: false }).pipe(gulpClean(null));
});