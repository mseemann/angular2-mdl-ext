// here you need to add your component - e.g the name of the folder in the components directorty
const components = [
    'expansion-panel',
    'popover',
    'select'
];

const angularPackages = [
    'core',
    'forms',
    'common',
    'compiler',
    'platform-browser',
    'platform-browser-dynamic',
    'http',
    'router'
];

const vendorPackages: any = {};

angularPackages.forEach(name => {
    vendorPackages[`@angular/${name}`] = { main: `bundles/${name}.umd.js` };
    vendorPackages[`@angular/${name}/testing`] = { main: `../bundles/${name}-testing.umd.js` };
});


vendorPackages['rxjs'] = { main: 'index.js' };
vendorPackages['angular2-mdl'] = { main: `bundle/angular2-mdl.js` };

/** Type declaration for ambient System. */
declare var System: any;

// Apply the vendor package configuration
System.config({
    map: {
        '@angular': 'vendor/@angular',
        'rxjs': 'vendor/rxjs',
        'angular2-mdl': 'vendor/angular2-mdl'
    },
    packages: vendorPackages
});


/** Map relative paths to URLs. */
const map: any = {};
/** User packages configuration. */
const packages: any = {};

components.forEach(name => {
    packages[`@angular2-mdl-ext/${name}`] = {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'index'
    };
});


// Apply the user's configuration.
System.config({ map, packages });
