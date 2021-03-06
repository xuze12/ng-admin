import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class PowerService {
  hasVisitPage = false;
  constructor(private router: Router) { }

  setPagePower(param: string) {

    // 超级管理员
    const roleInfo = JSON.parse(window.localStorage.getItem('loginUserInfo') || '{}')
    const is_admin = Reflect.has(roleInfo, 'name') && Reflect.get(roleInfo, 'name') === 'ADMIN';
    let power = {
      add: false,
      edit: false,
      del: false
    }

    // 超级管理员
    if (is_admin) {
      this.hasVisitPage = true;
      power = {
        add: true,
        edit: true,
        del: true
      }
      window.localStorage.setItem('power', JSON.stringify(power))
      return;
    }

    // 角色
    let allMenuPower = JSON.parse(window.localStorage.getItem('allMenuPower') || '[]');
    let tmier = null

    if (!window.localStorage.getItem('allMenuPower')) {
      if (tmier) {
        clearInterval(tmier)
      }
      tmier = setInterval(() => {
        if (window.localStorage.getItem('allMenuPower')) {
          allMenuPower = JSON.parse(window.localStorage.getItem('allMenuPower') || '[]');
          this.getAllMenuPower(param, allMenuPower, power);
          clearInterval(tmier);
        }
      }, 100);
      return;
    }

    this.getAllMenuPower(param, allMenuPower, power);
  }

  getAllMenuPower(param: string, allMenuPower: any, power: any) {

    // 角色 根据权限显示
    const hasItem = allMenuPower.find(item => item.name.includes(`${param}-list`));
    if (hasItem) {
      this.hasVisitPage = true;
      for (let item of allMenuPower) {
        if (item.name.includes(`${param}-add`)) {
          power.add = true;
        }
        if (item.name.includes(`${param}-edit`)) {
          power.edit = true;
        }
        if (item.name.includes(`${param}-del`)) {
          power.del = true;
        }
      }

    } else {
      // this.router.navigate(['/admin/403'])
      this.hasVisitPage = false;
    }

    window.localStorage.setItem('power', JSON.stringify(power))
  }
}
