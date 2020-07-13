import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router'

import { PowerService } from '../../../services/power.service';
import { MenuService } from '../../../services/menu.service';

interface RolesList {
  id: number;
  name: string;
  departmentId: number;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})

export class RolesComponent implements OnInit {

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: RolesList[] = [];
  setOfCheckedId = new Set<number>();
  rolesList: RolesList[] = [];
  power = {
    add: false,
    edit: false,
    del: false
  }
  pageMenu = [];

  constructor(
    private modal: NzModalService,
    private http: HttpClient,
    public notification: NzNotificationService,
    public router: Router,
    public powerService: PowerService,
    public menuService: MenuService,
  ) { }

  ngOnInit() {

    this.powerService.setPagePower('roles');
    this.power = JSON.parse(window.localStorage.getItem('power') || '{}');

    if (this.powerService.hasVisitPage) {
      this.getPageMenu();
      this.getRolesList();
    }
  }

  // 延迟获取pageHeader 值
  getPageMenu() {
    setTimeout(() => {
      this.pageMenu = this.menuService.pageMenu;
    }, 400)
  }

    /**
   * 菜单带页面权限列表
   */
  async getMenuList() {
    const url = '/api/api/permission/permission_group_menu/with_permission_group';

    try {
      const data: any = await this.http.get(url).toPromise();
      return data.code === 200 ? data.data : [];
    } catch (error) {
      console.log(error, '---err')
    }
  }

   /**
   * 获取权限页面列表
   */
  async getPagesList() {
    const url = '/api/api/permission/permission_group_permission';

    try {
      const data: any = await this.http.get(url).toPromise();
      return data.code === 200 ? data.data : [];
    } catch (error) {
      console.log(error, '---err')
    }
  }

   /**
   * 处理菜单列表数据 转树形结构
   */
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

  /**
  * 获取角色列表
  * */
  async getRolesList() {

    try {
      const url = '/api/api/user/role_info';
      const data: any = await this.http.get(url).toPromise();
      const rolesPowers = await this.getRolesPowers();

      if (data.code !== 200) {
        this.rolesList = [];
        return;
      }

      // const menuList = await this.getMenuList() ;
      // const pageList = await this.getPagesList();

      // for (let item of menuList) {

      // }
      // console.log(pageList,'---pageList')
      // console.log(menuList,'-----menuList')

      // for (let item of menuList) {
      //   let powerGroup = []
      //   let hasPowerGroup = pageList.filter(i => i.permissionGroupId === item.permissionGroupId);
  
      //   if (hasPowerGroup) {
      //     powerGroup = hasPowerGroup
      //   }
      //   item.power = powerGroup
      // }

      // const newMenuList = this.handleMenuList(menuList);
      // console.log(newMenuList,'-------------------newMenuList')

      this.rolesList = data.data.map(item => {
        const newItem = item;
        let power = new Set();
        const role_power_item = rolesPowers.filter(i => i.roleInfoId === newItem.id);
        console.log(role_power_item, '---role_power_item')
        const map = {};

        if (role_power_item.length > 0) {

          for (let j of role_power_item) {
            const {
              permissionGroupId = '',
              permissionGroup = '',
              permission = ''
            } = j.permissionGroupPermission || {};

            if (!permissionGroupId) {
              continue;
            }

            if (!map[permissionGroupId]) {
              map[permissionGroupId] = [`${permissionGroup.name}/`]
            }

            map[permissionGroupId].push(permission.description);
          }

          for (let key of Object.keys(map)) {
            const mapItem = map[key].join(',').replace('/,', '/');
            power.add(`${mapItem}`)
          }
        }

        Object.assign(item, {
          key: item.id,
          title: item.name,
          power: [...power].join('、'),
        })

        return item;
      }).filter((item) => item.name !== 'ADMIN')

    } catch (error) {
      console.log(error, '---err')
    }
  }

  /**
   * 查看角色权限
   */
  async getRolesPowers() {

    try {
      const url = '/api/api/permission/role_permission_group_permission';

      const data: any = await this.http.get(url).toPromise();
      return data.code !== 200 ? [] : data.data;
    } catch (error) {
      console.log(error, '---err')
    }
  }

  onCurrentPageDataChange($event: RolesList[]): void {

    this.listOfCurrentPageData = $event;
  }

  showDeleteConfirm(item: any): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: `<b style="color: red;">你正在删除角色(${item.name}),删除后不可恢复,你确定要删除？</b>`,
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.handleDeleteRoles(item);
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 提示框
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  /**
   * 删除角色
   * @param id 角色id
   */
  handleDeleteRoles = async (item: any) => {

    try {
      const url = `/api/api/user/role_info/${item.id}`

      const data: any = await this.http.delete(url).toPromise()
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '删除角色', data.message || '删除角色失败！')
        return;
      }

      this.createNotification('success', '删除角色', '删除角色成功！')
      this.getRolesList();

    } catch (error) {
      this.createNotification('error', '删除角色', error.message || '删除角色失败！')
      console.log(error, '---err')
    }
  }

  // 跳转编辑角色页面
  handleEditRoles(item: any) {
    window.localStorage.setItem('edit_roles_info', JSON.stringify(item));
    this.router.navigate(['/admin/roles/infoUpdata/', 'edit']);
  }
}
