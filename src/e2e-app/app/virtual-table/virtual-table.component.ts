import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { RowDataResponseInterface } from '../../../components/virtual-table/index';

@Component({
  selector: 'virtual-table-demo',
  templateUrl: 'virtual-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualTableDemo {
	
	private rowCountStream: Observable<number>;
	private rowDataStream: Observable<{rows: any[], offset: number, limit: number}>;

    onRowCountRequest() {
        console.log("on row count request");
        this.rowCountStream = this.requestRowCount();
    }

    onRowDataRequest(request) {
        console.log("on row data request");
        this.rowDataStream = this.requestRowData(request.offset, request.limit);
    }

    onSort(data) {
        console.log("sort data:", data);
    }

    onRowClick(event) {
        console.log("on row click", event);
    }

    onListItemClick(event) {
        console.log("on list item click", event);
    }

    onRowSelectionChange(event) {
        console.log("change row selection", event);
    }

    requestRowCount(): Observable<number> {
        return Observable.of(500).delay(1000);;
    }

    requestRowData(offset, limit): Observable<RowDataResponseInterface> {
        let rows = [];
        for(var i = offset; i < (offset + limit); i++) {
            rows.push({_id: i, _label: 'Test ' + i});
        }
        return Observable.of({rows, offset, limit}).delay(1000);
    }
}
