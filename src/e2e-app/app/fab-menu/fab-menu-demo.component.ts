import {Component} from '@angular/core'

@Component({
  selector: 'fab-menu-demo',
  templateUrl: 'fab-menu-demo.component.html',
  styleUrls: ['fab-menu-demo.component.scss']
})
export class FabMenuDemo {

  alert(msg: string){
    console.log(msg);
  }

}
