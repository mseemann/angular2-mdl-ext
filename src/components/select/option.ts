import {
  Component,
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
  public selectedValue: any;
  public onSelect: any = Function.prototype;

  ngAfterViewInit() {
    this.text = this.contentWrapper.nativeElement.textContent.trim();
  }
}
