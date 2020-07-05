import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolesPower'
})
export class RolesPowerPipe implements PipeTransform {

  transform(value: any) {
    console.log(value,'---value')
    let item = [];

    if (value) {
      item = value.map(i => i.description);
    }

    return item.join();
  }

}
