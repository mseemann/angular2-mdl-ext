import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'virtual-table-demo',
  templateUrl: 'virtual-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualTableDemo {

    onSort(data) {
        console.log("sort data:", data);
    }

    onRowClick(event) {
        console.log("on row click", event);
    }

    requestRowCount() {
        return Observable.of(500).delay(1000);;
    }

    requestRowData(offset, limit) {
        let rows = [];
        for(var i = offset; i < (offset + limit); i++) {
            rows.push({_id: i, _label: 'Test ' + i});
        }

        return Observable.of(rows).delay(1000);
    }
}
