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
const webpack = require("webpack");

const componentsDir = path.join(SOURCE_ROOT, 'components');


gulp.task(':watch:components:spec', () => {
    gulp.watch(path.join(componentsDir, '**/*.ts'), [':build:components:spec']);
    gulp.watch(path.join(componentsDir, '**/*.scss'), [':build:components:scss']);
    gulp.watch(path.join(componentsDir, '**/*.html'), [':build:components:assets']);
});

gulp.task(':build:components:assets', () => {

    return gulp.src([path.join(componentsDir, '**/*.*'), '!**/*.ts'])
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

    const mdlScss = path.join(PROJECT_ROOT, 'node_modules/@angular-mdl/core/scss');

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


function createUmdBundleByWebpack(component: string) {
    console.log(`create umd bundle for ${component}`);

    return new Promise( (resolve, reject)=>{
        webpack({
            entry: path.join(componentsDir, component,'index.ts'),
            output: {
                path: path.join(DIST_COMPONENTS_ROOT, component),
                filename: 'index.umd.js',
                libraryTarget: 'umd',
                library: 'angularMdl.'+component.replace(/-/g, "")
            },
            resolve: {
                extensions: ['.ts', '.js']
            },
            externals: {
                '@angular/core': {
                    root: ['ng', 'core'],
                    commonjs: '@angular/core',
                    commonjs2: '@angular/core',
                    amd: '@angular/core'
                },
                '@angular/common': {
                    root: ['ng', 'common'],
                    commonjs: '@angular/common',
                    commonjs2: '@angular/common',
                    amd: '@angular/common'
                },
                '@angular/forms': {
                    root: ['ng', 'forms'],
                    commonjs: '@angular/forms',
                    commonjs2: '@angular/forms',
                    amd: '@angular/forms'
                },
                '@angular/platform-browser': {
                    root: ['ng', 'platformBrowser'],
                    commonjs: '@angular/platform-browser',
                    commonjs2: '@angular/platform-browser',
                    amd: '@angular/platform-browser'
                },
                '@angular/platform-browser-dynamic': {
                    root: ['ng', 'platformBrowserDynamic'],
                    commonjs: '@angular/platform-browser-dynamic',
                    commonjs2: '@angular/platform-browser-dynamic',
                    amd: '@angular/platform-browser-dynamic'
                },
                '@angular/animations': {
                    root: ['ng', 'animations'],
                    commonjs: '@angular/animations',
                    commonjs2: '@angular/animations',
                    amd: '@angular/animations'
                },
                '@angular/platform-browser/animations': {
                    root: ['ng', 'platformBrowserAnimations'],
                    commonjs: '@angular/platform-browser/animations',
                    commonjs2: '@angular/platform-browser/animations',
                    amd: '@angular/platform-browser/animations'
                },
                'rxjs/Subject': {
                    root: ['rx', 'Subject'],
                    commonjs: 'rxjs/Subject',
                    commonjs2: 'rxjs/Subject',
                    amd: 'rxjs/Subject'
                },
                'rxjs/Observable': {
                    root: ['rx', 'Observable'],
                    commonjs: 'rxjs/Observable',
                    commonjs2: 'rxjs/Observable',
                    amd: 'rxjs/Observable'
                },
                '@angular-mdl/core': {
                    root: ['angularMdl', '@angular-mdl/core'],
                    commonjs: '@angular-mdl/core',
                    commonjs2: '@angular-mdl/core',
                    amd: '@angular-mdl/core'
                },
                'moment': {
                    root: ['moment', 'moment'],
                    commonjs: 'moment',
                    commonjs2: 'moment',
                    amd: 'moment'
                }
            },
            module: {

                rules: [
                    {
                        enforce: 'pre',
                        test: /.ts$/,
                        loader: 'string-replace-loader',
                        options: {
                            search: 'moduleId: module.id,',
                            replace: '',
                            flags: 'g'
                        }
                    },
                    {
                        test: /\.ts$/,
                        exclude: [
                            /\.(spec)\.ts$/
                        ],
                        use: [
                            {
                                loader: 'awesome-typescript-loader',
                                options: {
                                    configFileName:  path.join(componentsDir, 'tsconfig-ngc.json')
                                }
                            },
                            {
                                loader: 'angular2-template-loader'
                            }
                        ]
                    },
                    {
                        test: /\.html$/,
                        loader: 'html-loader'
                    }
                ]
            },
            plugins: [
                new webpack.SourceMapDevToolPlugin({
                    filename: component+'.js.map',
                    test: /\.js($|\?)/i
                })
            ]

        }, function(err: any, stats: any) {
            if(err){
                reject(err);
            } else {
                resolve();
            }
        });
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
        return p.then( () => {return createUmdBundleByWebpack(component);});
    }, Promise.resolve());

    return p;

});