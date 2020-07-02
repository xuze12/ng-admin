import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient, HttpParams } from '@angular/common/http'
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router'

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

  constructor(private modal: NzModalService, private http: HttpClient, public notification: NzNotificationService, public router: Router) { }

  ngOnInit() {

    this.getRolesList();
  }

  /**
  * 获取角色列表
  * */
  async getRolesList() {
    const url = '/api/api/user/role_info'

    try {
      const data: any = await this.http.get(url).toPromise()

      if (data.code === 200) {
        this.rolesList = data.data.map((item) => Object.assign(item, { key: item.id, title: item.name }))
        console.log(this.rolesList, 'getRolesList')
      } else {
        this.rolesList = []
      }

    } catch (error) {
      console.log(error, '---err')
    }
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: RolesList[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
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
      console.log(data, 'handleDeleteUser')
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
