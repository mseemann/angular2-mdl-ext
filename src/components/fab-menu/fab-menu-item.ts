import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {MdlFabMenuComponent} from './fab-menu'

@Component({
  selector: 'mdl-fab-menu-item',
  templateUrl: './fab-menu-item.html',
  styleUrls: ['./fab-menu-item.scss']
})
export class MdlFabMenuItemComponent implements OnInit {

  @Input()
  label: string
  @Input()
  icon: string
  @Input()
  fabMenu: MdlFabMenuComponent

  @Output('menu-clicked')
  menuClick: EventEmitter<any> = new EventEmitter()

  isHoovering: boolean = false

  constructor () {
  }

  ngOnInit () {
    this.isHoovering = false
  }

}
