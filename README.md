# @angular-mdl/*
Additional components for @angular-mdl/core that are not part of material design lite

**The master supports angular 4. If you are looking
for an angular 2 compatible version please refer to this branch: https://github.com/mseemann/angular2-mdl-ext/tree/angular2**

* current angular version: 4
* current angular-mdl version: 4

[![Build Status](https://travis-ci.org/mseemann/angular2-mdl-ext.svg?branch=master)](https://travis-ci.org/mseemann/angular2-mdl-ext)
[![Coverage Status](https://coveralls.io/repos/github/mseemann/angular2-mdl-ext/badge.svg?branch=master)](https://coveralls.io/github/mseemann/angular2-mdl-ext?branch=master)
[![Code Climate](https://codeclimate.com/github/mseemann/angular2-mdl-ext/badges/gpa.svg)](https://codeclimate.com/github/mseemann/angular2-mdl-ext)
[![dependencies Status](https://david-dm.org/mseemann/angular2-mdl-ext/status.svg)](https://david-dm.org/mseemann/angular2-mdl-ext)
[![devDependencies Status](https://david-dm.org/mseemann/angular2-mdl-ext/dev-status.svg)](https://david-dm.org/mseemann/angular2-mdl-ext?type=dev)

##The components

| Name | Provided By | Description | npm | documentation | status | demo
| --- | --- | --- | --- | --- | --- | --- |
| datepicker | [mseemann](https://github.com/mseemann) | a simpel date picker | [![npm version](https://badge.fury.io/js/@angular-mdl%2Fdatepicker.svg)](https://www.npmjs.com/package/@angular-mdl/datepicker)| [readme](https://github.com/mseemann/angular2-mdl-ext/tree/master/src/components/datepicker) | experimental | [demo](http://mseemann.io/angular2-mdl-ext/datepicker)
| expansion-panel | [abdulqadir93](https://github.com/abdulqadir93) | organise arbitrary content in an expansion panel | [![npm version](https://badge.fury.io/js/@angular-mdl%2Fexpansion-panel.svg)](https://www.npmjs.com/package/@angular-mdl/expansion-panel)| [readme](https://github.com/mseemann/angular2-mdl-ext/tree/master/src/components/expansion-panel) | experimental | [demo](http://mseemann.io/angular2-mdl-ext/expansion-panel)
| popover | [tb](https://github.com/tb) | component for showing arbitrary content in a popover | [![npm version](https://badge.fury.io/js/%40angular-mdl%2Fpopover.svg)](https://www.npmjs.com/package/@angular-mdl/popover)| [readme](https://github.com/mseemann/angular2-mdl-ext/tree/master/src/components/popover) | experimental | [demo](http://mseemann.io/angular2-mdl-ext/popover)
| select | [tb](https://github.com/tb) | component that shows a select box | [![npm version](https://badge.fury.io/js/%40angular-mdl%2Fselect.svg)](https://www.npmjs.com/package/@angular-mdl/select)| [readme](https://github.com/mseemann/angular2-mdl-ext/tree/master/src/components/select) | experimental | [demo](http://mseemann.io/angular2-mdl-ext/select)

Status means:

* proof of concept (0.0.x) - under development
* experimental (0.x.x) - under development, but already usable
* stable (^1.x.x) - basic feature set is complete and tests coverage is good

These components support AOT and TreeShaking!

### How to use the components
Install the components via npm. Please checkout the individual readme for each component from the table above.

Starting with version 0.2.0 every component has no css styles imported by default. You need to setup your build pipeline
to include the scss files from each component you want to use. This makes it possible to configure the theming for
the components you want to use.

If you are using webpack you may use the special webpack import syntax for node_modules:

```
@import '~@angular-mdl/core/scss/color-definitions';

$color-primary: $palette-blue-500;
$color-primary-dark: $palette-blue-700;
$color-accent: $palette-amber-A200;
$color-primary-contrast: $color-dark-contrast;
$color-accent-contrast: $color-dark-contrast;

@import '~@angular-mdl/core/src/scss-mdl/material-design-lite';

@import '~@angular-mdl/popover/popover';
@import '~@angular-mdl/select/select';
```

An other way is to include each component folder in the search path for your scss preprocessor. For example webpack:

```
	sassLoader: {
		includePaths: [
			'node_modules/@angular-mdl/popover',
			'node_modules/@angular-mdl/select'
		]
	}
```

If you are using an angular cli project you want to add the two lines of code to the angular-cli.json

```
{
    "apps": [{
            "styles": [
              "../node_modules/@angular2-mdl-ext/popover/popover.scss", <-- add this
              "../node_modules/@angular2-mdl-ext/select/select.scss" <-- add this
            ],
        }],
}

```

### Development

* npm start - local dev server
* npm build - build a production release
* npm test - run the unit tests

The coverage report is stored under: coverage/coverage-remap/index.html
