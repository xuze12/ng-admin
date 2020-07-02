import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient, HttpParams } from '@angular/common/http'
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router'


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
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  value?: string;

  list: TreeNodeInterface[] = [];

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  constructor(
    private modal: NzModalService,
    public router: Router,
    private http: HttpClient,
    private notification: NzNotificationService) { }

  ngOnInit(): void {

    this.getOrganizeList();

  }

  /**
   * 获取机构列表
   * */
  async getOrganizeList() {
    const url = '/api/api/user/department'

    try {
      const data: any = await this.http.get(url).toPromise()

      if (data.code === 200) {
        const newData = data.data.map((item) => Object.assign(item, { key: item.id, title: item.name}))
        const list = this.handleOrganizeList(newData);
        this.list = list
        console.log(this.list,'----getOrganizeList----list')
        this.list.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
      } else {
        this.list = []
      }
      window.localStorage.setItem('organizeList', JSON.stringify(this.list))

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
      // 以当前遍历项，的parentId,去map对象中找到索引的id
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


  // 展开子列表
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


  // modal
  showConfirm(item: any,): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: `你正在删除${item.name}机构，删除后不可恢复，确定要删除?`,
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOnOk: () => {
        console.log(item, '---item')
        this.handleOrganizaChilderDelete(item);
      },
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 提示框
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(
      type,
      title,
      message
    );
  }

  /**
   * 递归删除子组织
   * @param item 
   */
  handleOrganizaChilderDelete(item: any) {

    this.handleOrganizaDelete(item);

    if (item.children) {
      item.children.forEach(item => this.handleOrganizaChilderDelete(item))
    }
  }

  /**
   * @param id 组织id
   */
  async handleOrganizaDelete(item: any) {

    const { id } = item;
    const url = `/api/api/user/department/${id}`

    try {
      const data: any = await this.http.delete(url).toPromise()
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '删除失败', '删除组织失败！');
        return;
      }

      this.createNotification('success', '删除成功', '删除组织成功！');
      this.getOrganizeList();

    } catch (error) {
      this.createNotification('error', '删除失败', '删除组织失败！');
      console.log(error, '---err')
    }
  }

  /**
   * 获取单位新
   */
  handleEditOrganiza(item: any) {
    window.localStorage.setItem('organiza-item', JSON.stringify(item))
    this.router.navigateByUrl('/admin/organization/infoUpdate/update');
  }

}
