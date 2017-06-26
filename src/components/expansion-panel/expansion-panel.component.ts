import {
  Component,
  NgModule,
  ModuleWithProviders,
  AfterContentInit,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Output,
  Input,
  QueryList,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition, } from '@angular/animations';

@Component({
  selector: 'mdl-expansion-panel-header',
  template: `
    <ng-content></ng-content>
    <div class="mdl-expansion-panel__header--expand-icon" (click)="onClick()">
      <span *ngIf="!isExpanded" class="material-icons">expand_more</span>
      <span *ngIf="isExpanded" class="material-icons">expand_less</span>
    </div>
  `,
  host: {
    '[class.mdl-expansion-panel__header]': 'true'
  }
})
export class MdlExpansionPanelHeaderComponent {
  isExpanded: boolean = false;
  onChange: EventEmitter<null> = new EventEmitter<null>();

  onClick() {
    this.onChange.emit();
  }
}

@Component({
  selector: 'mdl-expansion-panel-header-list-content',
  template: '<ng-content></ng-content>',
  host: {
    '[class.mdl-expansion-panel__header--list-content]': 'true'
  }
})
export class MdlExpansionPanelHeaderListContentComponent { }

@Component({
  selector: 'mdl-expansion-panel-header-secondary-content',
  template: '<ng-content></ng-content>',
  host: {
    '[class.mdl-expansion-panel__header--secondary-content]': 'true'
  }
})
export class MdlExpansionPanelHeaderSecondaryContentComponent { }

@Component({
  selector: 'mdl-expansion-panel-content',
  template: '<ng-content></ng-content>',
  host: {
    '[class.mdl-expansion-panel__content]': 'true',
    '[@isExpanded]': 'isExpanded'
  },
  animations: [
    trigger('isExpanded', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0px' })),
      transition('false => true', [
        style({ height: '0px' }),
        animate('250ms ease-in')
      ]),
      transition('true => false', [
        animate('250ms ease-in')
      ])
    ])
  ]
})
export class MdlExpansionPanelContentComponent {
  isExpanded: string = 'false';
}

@Component({
  selector: 'mdl-expansion-panel-body',
  template: '<ng-content></ng-content>',
  host: {
    '[class.mdl-expansion-panel__content--body]': 'true'
  }
})
export class MdlExpansionPanelBodyComponent { }

@Component({
  selector: 'mdl-expansion-panel-footer',
  template: '<ng-content></ng-content>',
  host: {
    '[class.mdl-expansion-panel__content--footer]': 'true'
  }
})
export class MdlExpansionPanelFooterComponent { }

@Component({
  selector: 'mdl-expansion-panel',
  template: '<ng-content></ng-content>',
  host: {
    '[class.mdl-expansion-panel]': 'true',
    '[class.expanded]': 'expanded',
    '[class.disabled]': 'disabled',
    '[tabindex]': '0'
  }
})
export class MdlExpansionPanelComponent implements AfterContentInit {
  @ContentChild(MdlExpansionPanelHeaderComponent) header: MdlExpansionPanelHeaderComponent;
  @ContentChild(MdlExpansionPanelContentComponent) content: MdlExpansionPanelContentComponent;
  @Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() disabled: boolean = false;

  // expanded property is getter/setter for the internal 'isExpanded' flag
  @Input() public set expanded(bool: boolean) {
    this._toggle(bool);
  };
  private isExpanded: boolean = false;
  public get expanded() {
    return this.isExpanded;
  }

  ngAfterContentInit() {
    this.header.onChange.subscribe(() => {
      if (!this.disabled) this._toggle(!this.isExpanded);
    });
  }

  @HostListener('keyup', ['$event'])
  onKeyUp($event: any) {
    if ($event.key === 'Enter' && !this.disabled) this.toggle();
  }

  toggle() {
    this._toggle(!this.isExpanded);
  }

  expand() {
    this._toggle(true);
  }

  collapse() {
    this._toggle(false);
  }

  disableToggle() {
    this.disabled = true;
  }

  enableToggle() {
    this.disabled = false;
  }

  private _toggle(isExpanded: boolean) {
    this.isExpanded = isExpanded;
    this.content.isExpanded = `${isExpanded}`;
    this.header.isExpanded = isExpanded;
    this.onChange.emit(isExpanded);
  }
}

@Component({
  selector: 'mdl-expansion-panel-group',
  template: '<ng-content></ng-content>',
  host: {
    '[class.mdl-expansion-panel-group]': 'true'
  }
})
export class MdlExpansionPanelGroupComponent implements AfterContentInit {
  @ContentChildren(MdlExpansionPanelComponent) panels: QueryList<MdlExpansionPanelComponent>;
  expandedIndex: number = -1;

  ngAfterContentInit() {
    this.panels.forEach((panel, i) => {
      /**
       * Set the expanded index to the panel index which is initialized in expanded state
       *
       * Having more than one of the panels being initialized in expanded state
       * is NOT supported
       */
      if (panel.expanded) {
        if (this.expandedIndex > -1) {
          const errorMessage = `
            PanelGroup does not support more than one Panel to be expanded initially.
            
            Make sure only one <mdl-expansion-panel> receives input like [expanded]="true".
            `;
          this.throw(errorMessage);
        }
        this.expandedIndex = i;
      }

      /**
       * Expand the panel and collapse previously
       * expanded panel when a panel is toggled.
       * Save the new expanded panel index.
       */
      panel.onChange.subscribe((isExpanded: boolean) => {
        if (isExpanded) {
          if (i !== this.expandedIndex && this.expandedIndex >= 0) {
            this.panels.toArray()[this.expandedIndex].collapse();
          }
          this.expandedIndex = i;
        }
        if (!isExpanded && i === this.expandedIndex) {
          this.expandedIndex = -1;
        }
      });
    });
  }

  getExpanded(): number {
    return this.expandedIndex;
  }

  getPanel(index: number): MdlExpansionPanelComponent {
    return this.panels.toArray()[index];
  }

  private throw(message: string) {
    throw new Error(message);
  }
}

const MDL_EXPANSION_PANEL_DIRECTIVES = [
  MdlExpansionPanelGroupComponent,
  MdlExpansionPanelComponent,
  MdlExpansionPanelHeaderComponent,
  MdlExpansionPanelHeaderListContentComponent,
  MdlExpansionPanelHeaderSecondaryContentComponent,
  MdlExpansionPanelContentComponent,
  MdlExpansionPanelBodyComponent,
  MdlExpansionPanelFooterComponent
];

@NgModule({
  imports: [CommonModule],
  exports: MDL_EXPANSION_PANEL_DIRECTIVES,
  declarations: MDL_EXPANSION_PANEL_DIRECTIVES,
})
export class MdlExpansionPanelModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdlExpansionPanelModule,
      providers: []
    };
  }
}
