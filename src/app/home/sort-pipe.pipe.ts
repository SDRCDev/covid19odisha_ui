import { Pipe, PipeTransform } from '@angular/core';
/**
 * Sort table data 
 */
@Pipe({
    name: 'sortPipe'
})
export class SortPipePipe implements PipeTransform {

    transform(value: any[], param: string): any[] {
        if (value) {
            if (param == "slugId") {
                value.sort((a: any, b: any) => {
                    if (a.slugId < b.slugId) {
                        return -1;
                    } else if (a.slugId > b.slugId) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return value;
            } else if (param == "areaId") {
                value.sort((a: any, b: any) => {
                    if (a.areaId < b.areaId) {
                        return -1;
                    } else if (a.areaId > b.areaId) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return value;
            }
        }
    }
}
