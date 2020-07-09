import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpParams } from '@angular/common/http'
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';

import { PowerService } from '../../../services/power.service';
import { MenuService } from '../../../services/menu.service';

export interface TreeNodeInterface {
  key: string;
  name: string;
  type?: string;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})

export class PersonComponent implements OnInit {

  organizeList: TreeNodeInterface[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  personList: any = [];
  power = {
    add: false,
    edit: false,
    del: false
  }
  pageMenu = [];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public powerService: PowerService,
    public menuService: MenuService,
  ) { }

  ngOnInit(): void {

    this.powerService.setPagePower('person');
    console.log(this.powerService.hasVisitPage, '---hasVisitPage')
    this.power = JSON.parse(window.localStorage.getItem('power') || '{}');

    if (this.powerService.hasVisitPage) {
      this.getPageMenu();
      this.getPersonList();
      this.getOrganizeList();
    }
  }

  // 延迟获取pageHeader 值
  getPageMenu() {
    setTimeout(() => {
      this.pageMenu = this.menuService.pageMenu;
    }, 400)
  }

  /**
   * 获取机构列表
   */
  async getPersonList() {
    const url = '/api/api/user/user'

    try {
      const data: any = await this.http.get(url).toPromise()

      if (data.code === 200) {
        this.personList = data.data.map((item) => Object.assign(item, { key: item.id, title: item.name }))
        console.log(this.personList, 'getPersonList')
      } else {
        this.personList = []
      }

    } catch (error) {
      console.log(error, '---err')
    }
  }

  /**
   * 获取机构列表
   * */
  async getOrganizeList() {
    const url = '/api/api/user/department'

    try {
      const data: any = await this.http.get(url).toPromise()
      console.log(data, 'getOrganizeList')

      if (data.code === 200) {
        const newData = data.data.map((item) => Object.assign(item, { key: item.id, title: item.name }))
        const list = this.handleOrganizeList(newData);
        this.organizeList = list
        this.organizeList.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
        console.log(this.mapOfExpandedData, '------mapOfExpandedData')
      } else {
        this.organizeList = []
      }

      window.localStorage.setItem('organizeList', JSON.stringify(this.organizeList))

    } catch (error) {
      console.log(error, '---err')
    }
  }

  /**
   * 处理获取机构列表数据 转成树形结构
   */
  handleOrganizeList(array) {
    const list = [];
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

  // 转树形结构
  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  // 提示框
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  // 显示禁用用户弹框
  handleProhibitUserModalShow = (item: any) => {
    const action = item.tusers.enabled ? '禁用' : '启用';
    const contentText = item.tusers.enabled ? '管理员将不可登录' : '管理员将重新获取登录';
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: `<b>${action}管理员后，${contentText}，确定${action}管理员：<i style="color:red;">${item.name}(${item.tusers ? item.tusers.userName : ""})</i>？</b>`,
      nzOkText: `${action}`,
      nzCancelText: '取消',
      nzOnOk: () => {
        this.handleProhibitUser(item)
      }
    });
  }

  /**
   * 禁用用户
   * @param id 用户id
   * @param enabled 账号是否禁用 true 正常 false禁用
   */

  handleProhibitUser = async (item: any) => {

    const action = item.tusers.enabled ? '禁用' : '启用';

    try {
      const url = '/api/api/user/user/status'
      const params = {
        id: item.userId,
        enabled: !item.tusers.enabled
      }
      const data: any = await this.http.put(url, params).toPromise()
      console.log(data, 'handleProhibitUser')
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', `${action}用户`, `${action}用户失败！`)
        return;
      }

      this.createNotification('success', `${action}用户`, `${action}用户成功！`)
      this.getPersonList();

    } catch (error) {
      this.createNotification('error', `${action}用户`, `${action}用户失败！`)
      console.log(error, '---err')
    }
  }

  // 显示删除用户弹框
  handleDeleteUserModalShow = (item: any) => {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: `<b style="color: red">你正在删除${item.name}(${item.tusers ? item.tusers.userName : ""})管理员，删除后不可恢复，确定删除？</b>`,
      nzOkType: 'danger',
      nzOkText: '删除',
      nzOnOk: () => {
        this.handleDeleteUser(item);
      },
    });
  }

  /**
   * 删除用户
   * @param id 用户id
   */

  handleDeleteUser = async (item: any) => {
    try {
      const url = `/api/api/user/user/${item.id}`

      const data: any = await this.http.delete(url).toPromise()
      console.log(data, 'handleDeleteUser')
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '删除用户', '删除用户失败！')
        return;
      }

      this.createNotification('success', '删除用户', '删除用户成功！')
      this.getPersonList();

    } catch (error) {
      this.createNotification('error', '删除用户', '删除用户失败！')
      console.log(error, '---err')
    }
  }

  /**
   * 重置用户密码
   * @param adminPassword 超级管理员密码
   * @param password 当前用户管理员密码
   * @param userId 用户userId
   */
  handleResetUserPassword = async (item: any) => {
    console.log(item, '-----handleResetUserPassword')
    try {
      const url = '/api/api/user/user'

      const data: any = await this.http.put(url, item).toPromise()
      console.log(data, 'handleResetUserPassword')
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '重置用户密码', '重置用户密码失败！')
        return;
      }

      this.createNotification('success', '重置用户密码', '重置用户密码成功！')
      this.getPersonList();

    } catch (error) {
      this.createNotification('error', '重置用户密码', '禁用用户失败！')
      console.log(error, '---err')
    }
  }


}
