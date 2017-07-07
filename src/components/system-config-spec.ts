// here you need to add your component - e.g the name of the folder in the components directorty
const components = [
    'datepicker',
    'expansion-panel',
    'fab-menu',
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
    'router',
    'animations'
];

const vendorPackages: any = {};

angularPackages.forEach(name => {
    vendorPackages[`@angular/${name}`] = { main: `bundles/${name}.umd.js` };
    vendorPackages[`@angular/${name}/testing`] = { main: `../bundles/${name}-testing.umd.js` };
});

vendorPackages[`@angular/platform-browser/animations`] = { main: `../bundles/platform-browser-animations.umd.js` };
vendorPackages[`@angular/animations/browser`] = { main: `../bundles/animations-browser.umd.js` };
vendorPackages[`@angular-mdl/core`] = { main: `bundle/core.js` };

vendorPackages['rxjs'] = { main: 'index.js' };
vendorPackages['moment'] = { main: 'min/moment.min.js'};

/** Type declaration for ambient System. */
declare var System: any;

// Apply the vendor package configuration
System.config({
    map: {
        '@angular': 'vendor/@angular',
        '@angular-mdl/core': 'vendor/@angular-mdl/core',
        'rxjs': 'vendor/rxjs',
        'moment': 'vendor/moment'
    },
    packages: vendorPackages
});


/** Map relative paths to URLs. */
const map: any = {};
/** User packages configuration. */
const packages: any = {};

components.forEach(name => {
    packages[`@angular-mdl/${name}`] = {
        format: 'cjs',
        defaultExtension: 'js',
        main: 'index'
    };
});


// Apply the user's configuration.
System.config({ map, packages });
