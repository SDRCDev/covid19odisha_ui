import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getKeys',
  pure: false
})
export class GetKeysPipe implements PipeTransform {

  transform(value: any, args: any[] = null): any {
    return Object.keys(value)//.map(key => value[key]);
}

}
