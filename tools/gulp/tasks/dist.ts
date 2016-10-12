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
    .pipe(replace(/\s*moduleId:\s*module\.id\s*,?\s*/gm, '', {logs:{notReplaced:true}}))
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

/**
 * publish the package (determinde by the current working dir)
 */
function publishPackage() {
  var pJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  console.log(`publish ${pJson.name}:${pJson.version}`);

  return new Promise<any>( (resolve, reject) => {
    exec('npm publish --access public', (error: Error, stdout: Buffer, stderr: Buffer) => {
      if (error) {
        console.log(`error publishing ${pJson.name}`, error);
        reject(error);
      }
      resolve();
    });
  });
}
/**
 * determine the published npm version of the component
 * @param componentDir
 * @returns {Promise<any>}
 */
function getPublishedVersion(componentDir: string) {

  return new Promise<any>( (resolve, reject) => {

    var pJson = JSON.parse(fs.readFileSync(path.join(componentDir, 'package.json'), 'utf8'));

    exec(`npm show ${pJson.name} version`, (error: Error, stdout: Buffer, stderr: Buffer) => {
      if (error){
        reject(error);
      }
      const publishedVersion: string = stdout.toString().replace(/^\s+|\s+$/g, '');
      resolve(publishedVersion);
    });
  });
}

function publishComponent(dir: string) {

  const fullPath = path.join(DIST_COMPONENTS_ROOT, dir);

  return Promise.resolve()
    .then ( () => {
      process.chdir(fullPath);
      return Promise.resolve();
    })
    .then( () => {
      return getPublishedVersion(fullPath);
    })
    .then( (publishedVersion: any) => {
      console.log(`published version of ${dir} is: ${publishedVersion}`);

      var pJson = JSON.parse(fs.readFileSync(path.join(fullPath, 'package.json'), 'utf8'));
      console.log(`${dir}: version to publish is: ${pJson.version}`);

      return new Promise( (resolve, reject)=>{
        if (publishedVersion != pJson.version) {
          // publish that package
          publishPackage().then( () => {
            resolve();
          })

        } else {
          // nothing to do
          console.log('not published');
          resolve();
        }
      })
    });
}

gulp.task(':dist:publish', () => {

    // run through each component and publish it
    // keep the current dir, because we need to cd to every component to publish the component
    const currentDir = process.cwd();
    const possiblyComponents = fs.readdirSync(DIST_COMPONENTS_ROOT);

    // filter any non components
    const components = possiblyComponents.filter( (fileOrDir: string) => {
      const fullPath = path.join(DIST_COMPONENTS_ROOT, fileOrDir);
      const stat = fs.statSync(fullPath);
      return stat.isDirectory() && fs.existsSync(path.join(fullPath, 'package.json'));
    });

    let p = components.reduce(function(p: Promise<any>, item: string) {
      return p.then( () => {return publishComponent(item);});
    }, Promise.resolve());

    return p.then( () => {
      // restore the working dir.
      console.log(`set path to ${currentDir}`);
      process.chdir(currentDir);
      return Promise.resolve();
    });

});

// creates a build. the publishing must be done manually cd into dist/component; npm publish
gulp.task('dist:build', (done: () => void) => {
  runSequence(
    'clean',
    [
      ':build:components:assets',
      ':build:components:scss',
      ':build:components:ts',
      ':build:components:ngc'
    ],
    ':dist:removemoduleid',
    ':dist:inlinehtml',
    ':dist:inlinecss',
    ':build:components:umd',
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