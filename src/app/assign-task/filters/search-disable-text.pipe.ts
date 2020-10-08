import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDisable'
})
export class SearchDisableTextPipe implements PipeTransform {

  transform(tableData: any[], searchText: string): any[] {
    if (!tableData) return [];
    if (!searchText) return tableData;
    searchText = searchText.toLowerCase();
    return tableData.filter(details => {
      let values = [];
      if(!details.deactivated){
        values.push(details);
      }
      return JSON.stringify(values).toLowerCase().includes(searchText);
    });
  }
}
