import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'app-fab-menu',
  templateUrl: './fab-menu.html',
  styleUrls: ['./fab-menu.scss']
})
export class FabMenuComponent implements OnInit {

  @Input()
  alwaysShowTooltips: boolean

  constructor () {
  }

  ngOnInit () {
  }

}
