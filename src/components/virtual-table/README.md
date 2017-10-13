# Virtual-Table

### Installing

Install the package and angular2-virtual-scroll!

    npm i --save @angular-mdl/virtual-table

Please use the angular2-virtual-scroll from the peer dependency reference!

import the MdlVirtualTableModule and add it to your app.module imports:
    
    import { MdlVirtualTableModule } from '@angular-mdl/virtual-table';

### Browser Requirements

The IntersectionObserver is used for any table resize occurenc! Please be aware of using a modern browser ((see here for implementation status)[https://github.com/w3c/IntersectionObserver]) or use the official [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).

You can disable the IntersectionObserver by adding the directive intersection-observer-disabled. Be aware if you are using e.g. the table within @angular-mdl/core tabs component and the virtual table is inital hidden!

### Usage & API

    Visit [demo] for usage examples and API summary.
    [demo]: http://mseemann.io/angular2-mdl-ext/virtual-table

