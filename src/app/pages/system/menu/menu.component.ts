import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';

import { PowerService } from '../../../services/power.service';
import { MenuService } from '../../../services/menu.service';

export interface TreeNodeInterface {
  key: number;
  menuName: string;
  page?: any;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  list: TreeNodeInterface[] = [];
  pageId = 0;
  // 当前点击的菜单
  activeMenuItem: any = null;
  // 是否显示 添加菜单弹框
  addNavMenuModalOpen = false;
  // 是否显示 编辑菜单弹框
  editNavMenuModalOpen = false;
  //是否显示 选择页面弹框
  pageSelectModalOpen = false;
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  power = {
    add: false,
    edit: false,
    del: false
  }
  pageMenu = [];

  constructor(
    private modal: NzModalService,
    private http: HttpClient,
    private notification: NzNotificationService,
    public powerService: PowerService,
    public menuService: MenuService,
    public router: Router,
  ) { }

  ngOnInit(): void {

    this.powerService.setPagePower('menu');
    this.power = JSON.parse(window.localStorage.getItem('power') || '{}');

    if (this.powerService.hasVisitPage) {
      this.getPageMenu();
      this.getMenuList();
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

    try {
      const url = '/api/api/permission/permission_group_menu/with_permission_group';

      const data: any = await this.http.get(url).toPromise();

      if (data.code !== 200) {
        this.list = [];
        return;
      }

      const newData = data.data.map((item) => Object.assign(item, { key: item.id }))
      this.list = this.handleMenuList(newData);
      this.list.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });

    } catch (error) {
      console.log(error, '---err')
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

  // 列表展开关闭
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

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

  // 显示添加导航菜单弹框
  handleAddModalShow = (item: any = {}): void => {

    this.activeMenuItem = item;
    this.addNavMenuModalOpen = true;
  }

  // 提示框
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  /**
   * 添加导航
   * @param name 导航名称
   * @param parentId 父级id
   */

  handleAddOk = async (value: any) => {

    try {
      const url = '/api/api/permission/permission_group_menu';
      const params = {
        parentId: this.activeMenuItem.id || 0,
        name: value.menuName
      };

      const data: any = await this.http.post(url, params).toPromise();

      const is_error = !(data.code === 200);

      if (is_error) {
        this.createNotification('error', '添加失败', data.message || '添加导航失败！')
        return;
      }

      this.createNotification('success', '添加成功', '添加导航成功！')
      this.getMenuList();

      // 重新获取菜单信息
      // await this.menuService.getMenuList();

    } catch (error) {
      this.createNotification('error', '添加失败', error.message || '添加导航失败！')
      console.log(error, '---err')
    }

    this.addNavMenuModalOpen = false;
  }


  // 添加导航菜单模态框 关闭

  handleAddCancel = () => {

    this.addNavMenuModalOpen = false;
  }

  // 显示 编辑导航菜单弹框
  handleEditModalShow = (item: any): void => {

    window.localStorage.setItem('editMenuName', item.name);
    this.activeMenuItem = item
    this.editNavMenuModalOpen = true;
  }
  // 编辑导航菜单模态框 确认
  handleEditOk = async (value: any) => {

    try {

      const url = '/api/api/permission/permission_group_menu';
      const params = {
        id: this.activeMenuItem.id,
        name: value.menuName
      };

      const data: any = await this.http.put(url, params).toPromise();

      const is_error = !(data.code === 200);

      if (is_error) {
        this.createNotification('error', '编辑失败', data.message || '编辑导航失败！');
        return;
      }

      this.createNotification('success', '编辑成功', '编辑导航成功！');
      this.getMenuList();

      // 重新获取菜单信息
      // await this.menuService.getMenuList();

    } catch (error) {
      this.createNotification('error', '编辑失败', error.message || '编辑导航失败！');
      console.log(error, '---err')
    }

    this.editNavMenuModalOpen = false;
    window.localStorage.removeItem('editMenuName');
  }

  // 编辑导航菜单模态框 关闭
  handleEditCancel = (): void => {

    this.editNavMenuModalOpen = false;
    window.localStorage.removeItem('editMenuName');
  }

  // 显示 选择页面弹框
  handlePageSelectModalShow = (item: any, pageId?: number): void => {

    this.activeMenuItem = item;
    this.pageId = pageId;
    this.pageSelectModalOpen = true;
  }

  /**
   * 绑定权限页面
   * @param id 绑定菜单id
   * @param permissionGroupId 权限页面id
   */
  handlePageSelectOk = async (value: any) => {

    try {
      const url = '/api/api/permission/permission_group_menu';
      const params = {
        id: this.activeMenuItem.id,
        permissionGroupId: value.radioValue
      };

      const data: any = await this.http.put(url, params).toPromise();

      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '绑定权限页面', data.message || '绑定权限页面失败！');
        return;
      }

      this.createNotification('success', '绑定权限页面', '绑定权限页面成功！');
      this.getMenuList();

    } catch (error) {
      this.createNotification('error', '绑定权限页面', error.message || '绑定权限页面失败！');
      console.log(error, '---err')
    }

    this.pageSelectModalOpen = false;
  }

  // 选择页面弹框 关闭
  handlePageSelectCancel = (): void => {

    this.pageSelectModalOpen = false;
  }

  /**
   * 删除菜单项
   * @param id 绑定菜单id
   */
  handleDeleteMenuItem = async (item: any) => {

    try {
      const url = `/api/api/permission/permission_group_menu/${item.id}`;

      const data: any = await this.http.delete(url).toPromise();

      const is_error = !(data.code === 200);

      if (is_error) {
        this.createNotification('error', '删除菜单项', data.message || '删除菜单项失败！');
        return;
      }

      this.createNotification('success', '删除菜单项', '删除菜单项成功！');
      this.getMenuList();

    } catch (error) {
      this.createNotification('error', '删除菜单项', error.message || '删除菜单项失败！');
      console.log(error, '---err')
    }

  }

  /**
   * 递归删除菜单
   * @param item 
   */
  // handleMenuChilderDelete(item: any) {

  //   this.handleDeleteMenuItem(item);

  //   if (item.children) {
  //     item.children.forEach(item => this.handleMenuChilderDelete(item))
  //   }
  // }

  // 删除菜单
  showMenuDeleteConfirm(item: any): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '<b style="color: red;">你正在删除导航菜单,对应的菜单也会被删除,确定要删除？</b>',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => {
        // this.handleMenuChilderDelete(item)
        if (item.children && item.children.length > 0) {

          this.createNotification('error', '请先删除子级', '请先删除子级');
        } else {
          this.handleDeleteMenuItem(item);
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

}
