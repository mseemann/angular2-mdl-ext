import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {FabMenuComponent} from './fab-menu'

@Component({
  selector: 'mdl-fab-menu-item',
  templateUrl: './fab-menu-item.html',
  styleUrls: ['./fab-menu-item.scss']
})
export class FabMenuItemComponent implements OnInit {

  @Input()
  label: string
  @Input()
  icon: string
  @Input()
  fabMenu: FabMenuComponent

  @Output('menu-clicked')
  menuClick: EventEmitter<any> = new EventEmitter()

  isHoovering: boolean = false

  constructor () {
  }

  ngOnInit () {
    this.isHoovering = false
  }

}
