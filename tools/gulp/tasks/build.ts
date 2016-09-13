import * as gulp from 'gulp';
import { SOURCE_ROOT, DIST_COMPONENTS_ROOT, PROJECT_ROOT } from '../constants';
import * as path from 'path';
import * as fs from 'fs';
import * as gulpTs from 'gulp-typescript';
import WritableStream = NodeJS.WritableStream;

const gulpSourcemaps = require('gulp-sourcemaps');
const gulpMerge = require('merge2');
const print = require('gulp-print');
const gulpSass = require('gulp-sass');


const componentsDir = path.join(SOURCE_ROOT, 'components');

gulp.task(':build:components:assets', () => {

    return gulp.src(path.join(componentsDir, '**/*.!(ts|spec.ts)'))
        .pipe( <WritableStream> gulp.dest(DIST_COMPONENTS_ROOT));

});


gulp.task(':build:components:spec', () => {

    const tsConfigPath = path.join(componentsDir, 'tsconfig-spec.json');


    const tsProject = gulpTs.createProject(tsConfigPath, {
        typescript: require('typescript')
    });

    let pipe = tsProject.src()
        .pipe(gulpSourcemaps.init())
        .pipe(gulpTs(tsProject));
    let dts = pipe.dts.pipe(gulp.dest(DIST_COMPONENTS_ROOT));

    return gulpMerge([
        dts,
        pipe
            .pipe(gulpSourcemaps.write('.', {includeContent: false, sourceRoot: '../../../src/components'}))
            .pipe(gulp.dest(DIST_COMPONENTS_ROOT))
    ]);

});


gulp.task(':build:components:scss', () => {

    const mdlScss = path.join(PROJECT_ROOT, 'node_modules/angular2-mdl/src/scss-mdl');

    const sassOptions = {includePaths: [mdlScss]};

    return gulp.src(path.join(componentsDir, '**/*.scss'))
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(gulpSourcemaps.write('.'))
        .pipe(gulp.dest(DIST_COMPONENTS_ROOT));
})