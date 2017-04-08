import {
  Component, HostListener, Inject, InjectionToken, OpaqueToken, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MdlButtonComponent, MdlDialogReference } from '@angular-mdl/core';

export const CURRENT_DATE = new InjectionToken<Date>('current-date');

@Component({
  moduleId: module.id,
  selector: 'datepicker',
  templateUrl: 'datepicker.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DatePickerDialogComponent {

  @ViewChild('okButton') public okButton: MdlButtonComponent;

  constructor(
    private dialog: MdlDialogReference,
    @Inject( CURRENT_DATE) currentDate: Date) {

    dialog.onVisible().subscribe( () => {
        this.okButton.elementRef.nativeElement.focus();
    })
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialog.hide();
  }

  public onOk() {
    console.log('ok');
  }

  public onCancel() {

  }
}
