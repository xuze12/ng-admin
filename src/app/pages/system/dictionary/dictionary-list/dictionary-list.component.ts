import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router';

import { PowerService } from '../../../../services/power.service';
import { MenuService } from '../../../../services/menu.service';

export interface TreeNodeInterface {
  key: number;
  name: string;
  description: string;
  indeterminate?: boolean;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}


@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.scss']
})
export class DictionaryListComponent implements OnInit {

  dictionaryList = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  addAttrModalOpen = false;
  editAttrModalOpen = false;
  activeDictonaryItem: any = {};
  power = {
    add: false,
    edit: false,
    del: false
  }
  pageMenu = [];

  constructor(
    private modal: NzModalService,
    public powerService: PowerService,
    public menuService: MenuService,
    private http: HttpClient,
    private notification: NzNotificationService,
    public route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.powerService.setPagePower('dictionary');
    console.log(this.powerService.hasVisitPage, '---hasVisitPage')
    this.power = JSON.parse(window.localStorage.getItem('power') || '{}');

    if (this.powerService.hasVisitPage) {

      this.getPageMenu();
      console.log(this.menuService.pageMenu, '----this.menuService.pageMenu')
      this.getDictionaryList();
    }
  }

  // 延迟获取pageHeader 值
  getPageMenu() {
    setTimeout(() => {
      this.pageMenu = this.menuService.pageMenu;
    }, 400)
  }

  /**
  * 获取机构字典列表
  * @param department_type 目前固定写死
  * */
  async getDictionaryList() {
    const url = '/api/api/user/dictionary/key/department_type';

    try {
      const data: any = await this.http.get(url).toPromise();

      if (data.code !== 200) {
        this.dictionaryList = [];
        return;
      }
      const list = data.data.map(item => Object.assign(item, { key: item.id, key1: item.key, title: item.name })).sort((a, b) =>a.id-b.id);
      console.log(data, '---data')

      this.dictionaryList = this.handleTreeData(list);

      // 初始化操作权限
      this.dictionaryList.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });

    } catch (error) {
      console.log(error, '---')
      this.dictionaryList = [];
    }
  }
  // 提示框
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  // 显示 添加属性弹框
  handleAddAttrModalShow = (): void => {
    this.addAttrModalOpen = true;
  }

  /**
   * 添加机构字典
   * @param name 机构字典名称 
   * @param key 字典类型  目前 固定值department_type
   * @param description 描述
   */
  handleAddDictionary = async (params: any) => {
    console.log('-----params', params);

    const url = '/api/api/user/dictionary'

    Object.assign(params, { key: 'department_type' })

    try {
      const data: any = await this.http.post(url, params).toPromise()
      const is_error = !(data.code === 200)


      if (is_error) {
        this.createNotification('error', '新增机构字典', data.message || '新增机构字典失败！')
        return false;
      }

      this.createNotification('success', '新增机构字典', '新增机构字典成功！')
      // this.validateForm.reset();
      this.getDictionaryList();
      this.addAttrModalOpen = false;
      return true;

    } catch (error) {
      this.createNotification('error', '新增机构字典', error.message || '新增机构字典失败！');
      return false;
    }
  }


  // 添加属性弹框 关闭
  handleAddAttrCancel = (): void => {
    this.addAttrModalOpen = false;

  }

  // 显示 编辑属性弹框
  handleEditAttrModalShow = (item: any): void => {
    this.editAttrModalOpen = true;
    this.activeDictonaryItem = item;
  }

  /**
  * 编辑机构字典
  * @param name 机构字典名称 
  * @param key 字典类型  目前 固定值department_type
  * @param id 字典id
  * @param description 描述
  */
  handleEditDictionary = async (params: any) => {
    console.log('-----params', params);

    const url = '/api/api/user/dictionary'

    const id = this.activeDictonaryItem.id || '';

    Object.assign(params, { id })

    try {
      const data: any = await this.http.put(url, params).toPromise()
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '编辑机构字典', data.message || '编辑机构字典失败！')
        return false;
      }

      this.createNotification('success', '编辑机构字典', '编辑机构字典成功！')
      // this.validateForm.reset();
      this.getDictionaryList();
      this.editAttrModalOpen = false;
      this.activeDictonaryItem = {};
      return true;

    } catch (error) {
      this.createNotification('error', '编辑机构字典', error.message || '编辑机构字典失败！');
      return false;
    }
  }

  // 编辑属性弹框 关闭
  handleEditAttrCancel = (): void => {
    this.editAttrModalOpen = false;
    this.activeDictonaryItem = {};
  }

  // 删除属性
  showMenuDeleteConfirm(item: any): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: `<b style="color: red;">你正在删除${item.name}字典,删除后无法恢复,确定要删除？</b>`,
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.handleDeleteDictionary(item)
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  /**
 * 删除机构字典
 * @param id 机构字典id
 */
  handleDeleteDictionary = async (item: any) => {
    try {
      const url = `/api/api/user/dictionary/key/department_type/${item.id}`

      const data: any = await this.http.delete(url).toPromise()
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '删除机构字典', data.message || '删除机构字典失败！')
        return;
      }

      this.createNotification('success', '删除机构字典', '删除机构字典成功！')
      this.getDictionaryList();

    } catch (error) {
      this.createNotification('error', '删除机构字典', error.message || '删除机构字典失败！')
      console.log(error, '---err')
    }
  }


  // 转成树形结构
  handleTreeData(array: any) {
    const list = [];
    const map = {};

    for (let i = 0; i < array.length; i++) {
      map[i + 1] = array[i]
    }
    console.log(map, '---map')

    array.forEach(function (item, index) {
      // 以当前遍历项，的pid,去map对象中找到索引的id
      var parent = map[index];
      // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        list.push(item);
      }
    });
    console.log(list, '--------------list')

    return list;
  }


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

}
