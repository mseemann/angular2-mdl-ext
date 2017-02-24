# angular2-mdl-ext
Additional components for angular2-mdl that are not part of material design lite

[![Build Status](https://travis-ci.org/mseemann/angular2-mdl-ext.svg?branch=master)](https://travis-ci.org/mseemann/angular2-mdl-ext)
[![Coverage Status](https://coveralls.io/repos/github/mseemann/angular2-mdl-ext/badge.svg?branch=master)](https://coveralls.io/github/mseemann/angular2-mdl-ext?branch=master)
[![Code Climate](https://codeclimate.com/github/mseemann/angular2-mdl-ext/badges/gpa.svg)](https://codeclimate.com/github/mseemann/angular2-mdl-ext)
[![dependencies Status](https://david-dm.org/mseemann/angular2-mdl-ext/status.svg)](https://david-dm.org/mseemann/angular2-mdl-ext)
[![devDependencies Status](https://david-dm.org/mseemann/angular2-mdl-ext/dev-status.svg)](https://david-dm.org/mseemann/angular2-mdl-ext?type=dev)

##The components

| Name | Provided By | Description | npm | documentation | status | demo
| --- | --- | --- | --- | --- | --- | --- |
| expansion-panel | [abdulqadir93](https://github.com/abdulqadir93) | organise arbitrary content in an expansion panel | [![npm version](https://badge.fury.io/js/@angular2-mdl-ext%2Fexpansion-panel.svg)](https://badge.fury.io/js/@angular2-mdl-ext/expansion-panel)| [readme](https://github.com/mseemann/angular2-mdl-ext/tree/master/src/components/expansion-panel) | experimental | [demo](http://mseemann.io/angular2-mdl-ext/expansion-panel)
| popover | [tb](https://github.com/tb) | component for showing arbitrary content in a popover | [![npm version](https://badge.fury.io/js/%40angular2-mdl-ext%2Fpopover.svg)](https://badge.fury.io/js/@angular2-mdl-ext/popover)| [readme](https://github.com/mseemann/angular2-mdl-ext/tree/master/src/components/popover) | experimental | [demo](http://mseemann.io/angular2-mdl-ext/popover)
| select | [tb](https://github.com/tb) | component that shows a select box | [![npm version](https://badge.fury.io/js/%40angular2-mdl-ext%2Fselect.svg)](https://badge.fury.io/js/@angular2-mdl-ext/select)| [readme](https://github.com/mseemann/angular2-mdl-ext/tree/master/src/components/select) | experimental | [demo](http://mseemann.io/angular2-mdl-ext/select)

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
@import '~angular2-mdl/scss/color-definitions';

$color-primary: $palette-blue-500;
$color-primary-dark: $palette-blue-700;
$color-accent: $palette-amber-A200;
$color-primary-contrast: $color-dark-contrast;
$color-accent-contrast: $color-dark-contrast;

@import '~angular2-mdl/src/scss-mdl/material-design-lite';

@import '~@angular2-mdl-ext/popover/popover';
@import '~@angular2-mdl-ext/select/select';
```

An other way is to include each component folder in the search path for your scss preprocessor. For example webpack:

```
	sassLoader: {
		includePaths: [
			'node_modules/@angular2-mdl-ext/popover',
			'node_modules/@angular2-mdl-ext/select'
		]
	}
```

### Development

* npm start - local dev server
* npm build - build a production release
* npm start test - run the unit tests

The coverage report is stored under: coverage/coverage-remap/index.html
