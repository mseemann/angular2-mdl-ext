import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'mdl-option',
  host: {
    '[class.mdl-option__container]': 'true'
  },
  templateUrl: 'option.html'
})
export class MdlOptionComponent {
  @Input('value') public value: any;
  @ViewChild('contentWrapper') contentWrapper: ElementRef;
  public text: any;
  public multiple: boolean = false;
  public selected: boolean = false;
  public onSelect: any = Function.prototype;

  constructor(private changeDetectionRef: ChangeDetectorRef) {}

  updateSelected(value: any) {
    if (this.multiple) {
      this.selected = value.includes(this.value);
    } else {
      this.selected = this.value == value;
    }
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit() {
    this.text = this.contentWrapper.nativeElement.textContent.trim();
  }
}
