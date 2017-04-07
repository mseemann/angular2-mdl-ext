import * as gulp from 'gulp';
const karma = require('karma');
import * as path from 'path';
import { PROJECT_ROOT } from '../constants';
const runSequence = require('run-sequence');
import gulpMerge = require('merge2');
import WritableStream = NodeJS.WritableStream;

gulp.task(':build:test:vendor', () => {

    const npmVendorFiles = [
        '@angular',
        '@angular-mdl/core',
        'core-js/client',
        'rxjs',
        'systemjs/dist',
        'zone.js/dist'
    ];

    return gulpMerge(
        npmVendorFiles.map(function(root: string) {
            const inputs = path.join(root, '**/*.+(js|js.map)');
            const destFolder = path.join('dist/vendor', root);
            const dest = gulp.dest(destFolder);
            return gulp.src(path.join('node_modules', inputs)).pipe( <WritableStream> dest);
        }));
});

gulp.task(':test:deps', [], (done: any ) => {
    runSequence('clean',
        [
            ':build:test:vendor',
            ':build:components:assets',
            ':build:components:scss',
            ':build:components:spec'
        ],
        done);
});

gulp.task('test', [':test:deps', ':watch:components:spec'], (done: any) => {
    new karma.Server({
        configFile: path.join(PROJECT_ROOT, 'config/tests/karma.conf.js')
    }, done).start();
});

gulp.task('test:single-run', [':test:deps'], (done: any) => {
    new karma.Server({
        configFile: path.join(PROJECT_ROOT, 'config/tests/karma.conf.js'),
        singleRun: true
    }, done).start();
});
