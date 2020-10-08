import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverseResource'
})
export class ResourcesReversePipe implements PipeTransform {

  transform (input: any): any {
    
    if (input) {
      let obj = [];
      let reverseObj = input.reverse();
      for (let index = 0; index < reverseObj.length; index++) {
          const element = reverseObj[index];
          obj.push({description: reverseObj[index].description,
          firstName: reverseObj[index].firstName,
          id: reverseObj[index].id,
          isApprove: reverseObj[index].isApprove,
          publishedBy: reverseObj[index].publishedBy,
          resourceType: reverseObj[index].resourceType,
          resourceTypeId: reverseObj[index].resourceTypeId,
          sl_No:index+1,
          tag: reverseObj[index].tag.join(", "),
          title: reverseObj[index].title,
          uploadedOn: reverseObj[index].uploadedOn,
          videoLink: reverseObj[index].videoLink})
      }
      return obj;
    }
    return [];
  }

}
