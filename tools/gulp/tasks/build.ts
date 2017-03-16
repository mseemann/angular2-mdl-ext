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
const autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
const fs = require('fs');
const rollup = require('rollup').rollup;

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
            .pipe(gulpSourcemaps.write('.', {includeContent: false, sourceRoot: '../../../src/components/'}))
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

function createUmdBundle(component: string){

  console.log(`create umd bundle for ${component}`);

  const globals: {[name: string]: string} = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/forms': 'ng.forms',
    '@angular/platform-browser': 'ng.platformBrowser',
    '@angular/animations': 'ng.animations',
    '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
    '@angular-mdl/core': 'angularMdl',
    'rxjs/Subject': 'Rx',
    'rxjs/Observable': 'Rx'
  };

  return rollup({
    entry: path.join(DIST_COMPONENTS_ROOT, component,  'index.js'),
    context: 'this',
    external: Object.keys(globals)
  }).then((bundle: { generate: any }) => {
    const result = bundle.generate({
        // remove - from the name - otherwise the umd name is not a valid name
      moduleName: 'angular2Mdl.'+component.replace(/-/g, ""),
      format: 'umd',
      globals,
      sourceMap: true,
      dest: path.join(DIST_COMPONENTS_ROOT, component, 'index.umd.js')
    });

    fs.writeFileSync(path.join(DIST_COMPONENTS_ROOT, component, 'index.umd.js'), result.code, 'utf8');
    fs.writeFileSync(path.join(DIST_COMPONENTS_ROOT, component, 'index.umd.js.map'), result.map, 'utf8');
  });

}

gulp.task(':build:components:umd', () => {

  const possiblyComponents = fs.readdirSync(componentsDir);

  // filter any non components
  const components = possiblyComponents.filter( (fileOrDir: string) => {
    const fullPath = path.join(componentsDir, fileOrDir);
    const stat = fs.statSync(fullPath);
    return stat.isDirectory() && fs.existsSync(path.join(fullPath, 'package.json'));
  });

  let p = components.reduce(function(p: Promise<any>, component: string) {
    return p.then( () => {return createUmdBundle(component);});
  }, Promise.resolve());

  return p;

});
