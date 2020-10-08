import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

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
          galleryType: reverseObj[index].galleryType,
          galleryTypeId: reverseObj[index].galleryTypeId,
          sl_No:index+1,
          tag: reverseObj[index].tag,
          caption: reverseObj[index].caption,
          uploadedOn: reverseObj[index].uploadedOn,
          videoLink: reverseObj[index].videoLink})
      }
      return obj;
    }
    return [];
  }

}
