import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'organizaType'
})
export class OrganizaTypePipe implements PipeTransform {

  /**
   * 
   * @param value type 类型 1军 2师 3旅 4营
   */
  
  transform(value: number, args?: any): string {
    let type = ''
    if(value===1) {
      type='军'
    }else if(value===2) {
      type='师'
    }if(value===3) {
      type='旅'
    }if(value===4) {
      type='营'
    }
    return type;
  }

}
