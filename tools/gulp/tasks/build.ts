import * as gulp from 'gulp';
import { SOURCE_ROOT, DIST_COMPONENTS_ROOT, PROJECT_ROOT } from '../constants';
import * as path from 'path';
import * as gulpTs from 'gulp-typescript';
import WritableStream = NodeJS.WritableStream;

var exec = require('child_process').exec;
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpMerge = require('merge2');
const print = require('gulp-print');
const gulpSass = require('gulp-sass');
const replace = require('gulp-string-replace');
const autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');

const componentsDir = path.join(SOURCE_ROOT, 'components');


gulp.task(':watch:components:spec', () => {
    gulp.watch(path.join(componentsDir, '**/*.ts'), [':build:components:spec']);
    gulp.watch(path.join(componentsDir, '**/*.scss'), [':build:components:scss']);
    gulp.watch(path.join(componentsDir, '**/*.html'), [':build:components:assets']);
});

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
        .pipe(tsProject());
    let dts = pipe.dts.pipe(gulp.dest(DIST_COMPONENTS_ROOT));

    return gulpMerge([
        dts,
        pipe
            .pipe(gulpSourcemaps.write('.', {includeContent: false, sourceRoot: '../../../src/components'}))
            .pipe(gulp.dest(DIST_COMPONENTS_ROOT))
    ]);

});

gulp.task(':build:components:ts', () => {

  const tsConfigPath = path.join(componentsDir, 'tsconfig-ngc.json');

  const tsProject = gulpTs.createProject(tsConfigPath, {
    typescript: require('typescript')
  });

  let pipe = gulp.src([path.join(componentsDir, '**/*.ts'), '!**/*.spec.ts'])
    .pipe(gulpSourcemaps.init())
    .pipe(tsProject());
  let dts = pipe.dts.pipe(gulp.dest(DIST_COMPONENTS_ROOT));

  return gulpMerge([
    dts,
    pipe
      .pipe(gulpSourcemaps.write('.', {includeContent: false}))
      .pipe(gulp.dest(DIST_COMPONENTS_ROOT))
  ]);

});

gulp.task(':build:components:ngc', (done: () => void) => {

  const tsConfigPath = path.join(componentsDir, 'tsconfig-ngc.json');

  exec('ngc -p '+tsConfigPath, (error: Error, stdout: Buffer, stderr: Buffer) => {
    if(error){
      console.log(`ngc error`, error);
    }
    done();
  });
});

gulp.task(':build:components:scss', () => {

    const mdlScss = path.join(PROJECT_ROOT, 'node_modules/angular2-mdl/scss');

    const sassOptions = {includePaths: [mdlScss]};

    return gulp.src(path.join(componentsDir, '**/*.scss'))
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulpSourcemaps.write('.'))
        .pipe(gulp.dest(DIST_COMPONENTS_ROOT));
});