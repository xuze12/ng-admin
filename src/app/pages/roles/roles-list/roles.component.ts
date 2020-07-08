import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  ) {
  }

  ngOnInit() {
    this.powerService.setPagePower('roles');
    console.log(this.powerService.hasVisitPage, '---hasVisitPage')
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
  * 获取角色列表
  * */
  async getRolesList() {
    const url = '/api/api/user/role_info';

    try {
      const data: any = await this.http.get(url).toPromise();
      const rolesPowers = await this.getRolesPowers();

      if (data.code !== 200) {
        this.rolesList = [];
        return;
      }

      this.rolesList = data.data.map(item => {
        let power = []
        const role_power_item = rolesPowers.filter(i => i.roleInfoId === item.id);

        const map = {};
        if (role_power_item.length > 0) {

          role_power_item.map(j => {
            const permissionGroupId = j.permissionGroupPermission.permissionGroupId;
            const permissionGroup = j.permissionGroupPermission.permissionGroup;
            const permission = j.permissionGroupPermission.permission;
            if (!map[permissionGroupId]) {
              map[permissionGroupId] = [`${permissionGroup.name}/`]
            }
            map[permissionGroupId].push(permission.description);
          })

          for (let key of Object.keys(map)) {
            const mapItem = map[key].join(',').replace('/,', '/');
            power.push(`${mapItem}`)
          }
        }

        Object.assign(item, {
          key: item.id,
          title: item.name,
          power: power.join('、'),
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
    const url = '/api/api/permission/role_permission_group_permission';
    try {
      const data: any = await this.http.get(url).toPromise();
      return data.code !== 200 ? [] : data.data;
    } catch (error) {
      console.log(error, '---err')
    }
  }


  onCurrentPageDataChange($event: RolesList[]): void {
    this.listOfCurrentPageData = $event;
    // this.refreshCheckedStatus();
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
        this.createNotification('error', '删除角色', '删除角色失败！')
        return;
      }

      this.createNotification('success', '删除角色', '删除角色成功！')
      this.getRolesList();

    } catch (error) {
      this.createNotification('error', '删除角色', '删除角色失败！')
      console.log(error, '---err')
    }
  }

  // 跳转编辑角色页面
  handleEditRoles(item: any) {
    window.localStorage.setItem('edit_roles_info', JSON.stringify(item))
    this.router.navigate(['/admin/roles/infoUpdata/', 'edit']);
  }
}
