import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menus = [
    {
      key: 1,
      level: 1,
      title: '角色管理',
      icon: 'mail',
      open: false,
      selected: false,
      disabled: false,
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
        },
      ]
    },
    {
      key: 2,
      level: 1,
      title: '账号管理',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false,
      children: [
        {
          key: 21,
          level: 2,
          title: '组织机构管理',
          icon: 'user',
          selected: false,
          disabled: false,
          link: '/admin/organization'
        },
        {
          key: 22,
          level: 2,
          title: '人员管理',
          icon: 'user',
          selected: false,
          disabled: false,
          link: '/admin/person'
        }
      ]
    },
    {
      key: 3,
      level: 1,
      title: '系统维护',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false,
      children: [
        {
          key: 32,
          level: 2,
          title: '数据字典',
          icon: 'user',
          selected: false,
          disabled: false,
          link: '/admin/system/dictionary-list'
        }
      ]
    }
  ];
  newMenus = []

  constructor() { }

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
    stack.push({ ...root, level: 1});

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, parent: node});
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
    const pathname = window.location.pathname
    for (let i = 0; i < this.newMenus.length; i++) {
      const item = this.newMenus[i];

      if (Array.isArray(item)) {
        const target = item.find(a => a.link! === pathname)!;

        if (target) {
          const pageMenu= this.getPageMenu(target)
          localStorage.setItem('pageMenu', JSON.stringify(pageMenu));
        }
      }
    }
  }

  // 点击menuItem 改变pageMenu值
  handleMenuChange(value: any) {
    console.log( this.newMenus,'--- this.newMenus')
    for (let i = 0; i < this.newMenus.length; i++) {
      const item = this.newMenus[i];

      if (Array.isArray(item)) {
        const target = item.find(a => a.key === value.key)!;

        if (target) {
          const pageMenu= this.getPageMenu(target)
          console.log(pageMenu,'----pageMenu')
          localStorage.setItem('pageMenu', JSON.stringify(pageMenu));
        }
      }
    }
  }

  getPageMenu(object) {
    const array =[]
    const get = (object,array)=>{
      let menu = {}
      for (let item in object){
        if(item === 'parent') {
          get(object[item],array)
        }else {
          menu = object
        }
      }
      array.push(menu)
    }
    get(object,array)
   const newarray =  array.sort((a,b)=>a.level-b.level)

   return newarray

  }


  


}
