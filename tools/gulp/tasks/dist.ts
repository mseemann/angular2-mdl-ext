import * as gulp from 'gulp';
const runSequence = require('run-sequence');
var exec = require('child_process').exec;
import { DIST_COMPONENTS_ROOT } from '../constants';
import * as path from 'path';
const replace = require('gulp-string-replace');
const glob = require('glob');
const fs = require('fs');

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

gulp.task(':dist:inlinehtml', ( done: (err?: any) => void ) => {

  const files = glob.sync(path.join(DIST_COMPONENTS_ROOT, '**/*.js'), {});
  files.forEach( (file: string) => {
    const content = fs.readFileSync(file, 'utf-8');
    const result = content.replace(/templateUrl:\s*'([^']+?\.html)'/g, (fullMatch: string, templateUrl: string) => {
      const templateFile = path.join(path.dirname(file), templateUrl);
      const templateContent = fs.readFileSync(templateFile, 'utf-8');
      const shortenedTemplate = templateContent
        .replace(/([\n\r]\s*)+/gm, ' ') // replace line feed
        .replace(/"/g, '\\"'); // escape "
      return `template: "${shortenedTemplate}"`;
    })
    fs.writeFileSync(file, result, 'utf-8');
  })

  done();
});

gulp.task(':dist:inlinecss', ( done: (err?: any) => void ) => {

  const files = glob.sync(path.join(DIST_COMPONENTS_ROOT, '**/*.js'), {});
  files.forEach( (file: string) => {
    const content = fs.readFileSync(file, 'utf-8');
    const result = content.replace(/styleUrls:\s*(\[[\s\S]*?\])/gm, (fullMatch: string, styleUrls: string) => {
      const urls = eval(styleUrls);
      return 'styles: ['
        + urls.map( (styleUrl: string) => {
          const styleFile = path.join(path.dirname(file), styleUrl);
          const styleContent = fs.readFileSync(styleFile, 'utf-8');
          const shortenedStyle = styleContent
            .replace(/([\n\r]\s*)+/gm, ' ') // remove line feeds
            .replace(/"/g, '\\"'); // escape "
          return `"${shortenedStyle}"`;
        })
          .join(',\n')
        + ']';
    })
    fs.writeFileSync(file, result, 'utf-8');
  })

  done();
});

gulp.task(':dist:publish', (done: () => void) => {
  // run through each component and publish it
  // keep the current dir, because we need to cd to every component to publish the component
  const currentDir = process.cwd();
  const components = fs.readdirSync(DIST_COMPONENTS_ROOT);
  components.forEach( (fileOrDir: string) => {
    const fullPath = path.join(DIST_COMPONENTS_ROOT, fileOrDir);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (fs.existsSync(path.join(fullPath, 'package.json'))) {

        process.chdir(fullPath);

        // exec('npm view version \'dist-tags\'.latest', (error: Error, stdout: Buffer, stderr: Buffer) => {
        //   const publishedVersion = stdout.toString().replace(/^\s+|\s+$/g, '');
        //   console.log(`${fileOrDir}: published version is:${publishedVersion}`);
        //
        //   var pJson = JSON.parse(fs.readFileSync(path.join(fullPath, 'package.json'), 'utf8'));
        //   console.log(`${fileOrDir}: version to publish is:${pJson.version}`);
        //
        //   if (publishedVersion != pJson.version) {
            console.log(`publishing ${fileOrDir}`);
            exec('npm publish --access public', (error: Error, stdout: Buffer, stderr: Buffer) => {
              if(error){
                console.log(`error publishing ${fileOrDir}`, error);
              }
            });
        //   }
        // });

      }
    }
  })
  // restore the working dir.
  process.chdir(currentDir);
  done();
});

// creates a build the publishing must be done manually cd into dist/component; npm publish
gulp.task('dist:build', (done: () => void) => {
  runSequence(
    'clean',
    [
      ':build:components:assets',
      ':build:components:scss',
      ':build:components:ts'
    ],
    ':dist:removemoduleid',
    ':dist:inlinehtml',
    ':dist:inlinecss',
    done);
});

//build and publis all
gulp.task('dist', function(done: () => void) {
  runSequence(
    ':dist:checknpmuser',
    'dist:build',
    ':dist:publish',
    done);
});