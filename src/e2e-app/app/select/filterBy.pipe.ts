import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterBy',
})
export class FilterByPipe implements PipeTransform {
    transform(input: any[] = [], property: string, value: string): any {
        return input.filter((item: any) =>
            !value || item[property].toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    }
}
