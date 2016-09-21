# Popover

### Installing

    npm i --save @angular2-mdl-ext/popover

    import { MdlPopoverModule } from '@angular2-mdl-ext/popover';

### Usage example

    <button
        mdl-button
        (click)="myPopover.toggle($event)"
        mdl-button-type="icon"
        mdl-ripple>
      <mdl-icon>more_vert</mdl-icon>
    </button>
    
    <mdl-popover #myPopover [style.width.px]="300">
      <div mdl-shadow="6" style="padding: 1rem;">
        <b>This is example popover</b> you can put any HTML content here.
      </div>
    </mdl-popover>

### API Summary

#### mdl-popover

| Name | Type | Description |
| --- | --- | --- |
| `[hide-on-click]` | boolean | Hide popover on clicking inside it, default `false`
| `[style.*]` | ... | Styling i.e. `[style.width.px]="300"`
