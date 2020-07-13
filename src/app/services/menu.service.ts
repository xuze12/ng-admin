import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable } from 'rxjs'

export interface TreeNodeInterface {
  key: number;
  menuName: string;
  page?: any;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

const menus = [
  {
    key: 2,
    level: 1,
    title: '账号管理',
    icon: 'team',
    open: false,
    selected: false,
    disabled: false,
    link: '',
    children: [{
      key: 21,
      level: 2,
      title: '组织机构管理',
      icon: 'user',
      selected: false,
      disabled: false,
      link: '/admin/organization/list'
    }, {
      key: 22,
      level: 2,
      title: '人员管理',
      icon: 'user',
      selected: false,
      disabled: false,
      link: '/admin/person/list'
    }]
  }, {
    key: 1,
    level: 1,
    title: '角色管理',
    icon: 'mail',
    open: false,
    selected: false,
    disabled: false,
    link: '',
    children: [
      {
        key: 11,
        level: 2,
        title: '角色列表',
        icon: 'bars',
        open: false,
        selected: false,
        disabled: false,
        link: '/admin/roles/list',
      }]
  }, {
    key: 3,
    level: 1,
    title: '系统维护',
    icon: 'team',
    open: false,
    selected: false,
    disabled: false,
    link: '',
    children: [{
      key: 32,
      level: 2,
      title: '数据字典',
      icon: 'user',
      selected: false,
      disabled: false,
      link: '/admin/system/dictionary/list'
    }, {
      key: 32,
      level: 2,
      title: '菜单配置',
      icon: 'user',
      selected: false,
      disabled: false,
      link: '/admin/system/menu/list'
    }]
  }];

@Injectable({
  providedIn: 'root'
})

export class MenuService {
  menus = []
  newMenus = [];
  roleInfoPower = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  list = [];
  pageMenu = [];

  stream = new Observable<any>((observer => {
    observer.next(this.pageMenu)
  }))

  constructor(public http: HttpClient, private router: Router) { }

  /**
   * 获取登录用户拥有权限
   * @param roleInfoId 角色id
   */
  async getRolesPowers() {
    const url = '/api/api/permission/role_permission_group_permission';
    try {
      const data: any = await this.http.get(url).toPromise();

      this.roleInfoPower = data.code !== 200 ? [] : data.data;

      let power = [];
      let allMenuPower = [];
      const map = {};
      const roleInfo = JSON.parse(window.localStorage.getItem('loginUserInfo') || '{}');
      let role_power = this.roleInfoPower.filter(item => item.roleInfoId === roleInfo.roleInfoId);

      if (!Array.isArray(role_power) || role_power.length === 0) {
        return;
      }

      console.log(role_power, '------role_power');

      for (let item of role_power) {

        const {
          permissionGroupId = '',
          permissionGroup = '',
          permission = ''
        } = item.permissionGroupPermission || {};

        if (!permissionGroupId) {
          continue;
        }

        if (!map[permissionGroupId]) {
          map[permissionGroupId] = {
            name: permissionGroup.name,
            permissionGroupId: permissionGroupId,
            power: []
          }
        }
        map[permissionGroupId].power.push(permission);
        allMenuPower.push(permission)
      }

      for (let key of Object.keys(map)) {
        power.push(map[key])
      }

      window.localStorage.setItem('allMenuPower', JSON.stringify(allMenuPower));

      return power;
    } catch (error) {
      console.log(error, '---err')
    }
  }

  /**
  * 菜单带页面权限列表
  */
  async getMenuList() {
    const url = '/api/api/permission/permission_group_menu/with_permission_group'

    try {

      const data: any = await this.http.get(url).toPromise()
      if (data.code === 200) {
        const newData = data.data.map((item) => Object.assign(item, { key: item.id }))
        console.log(newData, '----------------getMenuList--------------------')

        const power = await this.getRolesPowers();
        console.log(power, '---power');

        for (let item of newData) {
          let hasParentPowerLink = '';

          const hasParentPower = power.find(powerItem => powerItem.permissionGroupId === item.permissionGroupId)
          if (hasParentPower) {
            for (let i of hasParentPower.power) {
              if (i.url.includes('list')) {
                hasParentPowerLink = i.url.replace(/\*|$\//g, '')
              }
            }
          }
          Object.assign(item, {
            link: hasParentPowerLink,
            open: false,
            selected: false,
            disabled: false, title: item.name
          })
        }

        console.log(newData, '----zzzzz-------newData');

        const list = this.handleMenuList(newData);
        console.log(list, 'list---')


        let menuList = list;

        this.isHasLinkItem(menuList);
        console.log(menuList, '-----menuList')

        menuList = menuList.filter(item => item.children.length > 0 || item.link !== '');

        // 判断菜单是否为空 否 设置第一个子菜单为首页
        if (menuList.length > 0) {

          // 判断父级是否有跳转 url 
          if (menuList[0].link) {
            this.router.navigate([`/admin/${menuList[0].link}`])
          } else {
            // 子菜单 是否有 url
            const fristChild = menuList[0].children;
            fristChild.length > 0
              ? this.router.navigate([`/admin/${fristChild[0].link}`])
              : this.router.navigate([`/admin/403`])
          }

        } else {
          this.router.navigate([`/admin/403`])
        }

        this.menus = menuList
        this.getNewMenus();
        this.urlFindMenuItem();

      } else {
        this.menus = []
      }

    } catch (error) {
      console.log(error, '---err')
    }
  }

  isHasLinkItem(array: any) {

    const childrenHasLink = (parent, target) => {

      if (target.children) {
        childrenHasLink(target, target.children)
      }

      parent.children = parent.children.filter(item => item.children && item.children.length > 0 || item.link !== '');
    }

    for (let item of array) {
      childrenHasLink(item, item.children);
    }
  }




  /**
   * 处理菜单列表数据 转树形结构
   * */

  handleMenuList(array) {
    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    const map = {};
    for (let i = 0; i < array.length; i++) {
      map[array[i].id] = array[i]
    }
    var val = [];
    array.forEach(function (item) {
      // 以当前遍历项，的pid,去map对象中找到索引的id
      var parent = map[item.parentId];
      // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {

        (parent.children || (parent.children = [])).push(item);
      } else {
        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    });
    return val;
  }

  getNewMenus() {

    for (let i = 0; i < this.menus.length; i++) {
      const item = this.menus[i]
      this.newMenus[item.key] = this.convertTreeToList(item);
    }
  }

  convertTreeToList(root) {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 1 });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node, hashMap: { [key: string]: boolean }, array): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  // 根据获取 pathname 初始化pageMenu值
  urlFindMenuItem() {
    setTimeout(() => {
      const hash = window.location.hash.replace('#/admin/', '');
      for (let i = 0; i < this.newMenus.length; i++) {
        const item = this.newMenus[i];

        if (Array.isArray(item)) {
          // console.log(hash, 'urlFindMenuItem======hash')
          const target = item.find(a => a.link.includes(hash));
          // console.log(target, 'urlFindMenuItem======target')
          if (target) {
            const pageMenu = this.getPageMenu(target);
            // console.log(pageMenu, 'urlFindMenuItem======pageMenu')
            this.pageMenu = pageMenu;
          }
        }
      }
    }, 100)
  }

  // 点击menuItem 改变pageMenu值
  handleMenuChange(value: any) {
    for (let i = 0; i < this.newMenus.length; i++) {
      const item = this.newMenus[i];

      if (Array.isArray(item)) {
        const target = item.find(a => a.key === value.key);
        console.log(target, '-------target')

        if (target) {
          const pageMenu = this.getPageMenu(target);
          console.log(pageMenu, 'handleMenuChange======pageMenu')
          this.pageMenu = pageMenu;
        }
      }
    }
  }

  getPageMenu(object) {
    const array = []
    const get = (object, array) => {
      let menu = {}
      for (let item in object) {
        if (item === 'parent') {
          get(object[item], array)
        } else {
          menu = object
        }
      }
      array.push(menu)
    }
    get(object, array)

    return array.sort((a, b) => a.level - b.level)
  }

}
