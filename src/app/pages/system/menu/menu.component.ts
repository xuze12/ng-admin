import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface TreeNodeInterface {
  key: number;
  menuName: string;
  page?: any;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  listOfMapData: TreeNodeInterface[] = [
    {
      key: 1,
      menuName: '账号管理',
      page: { name: '', url: '' },
      address: 'New York No. 1 Lake Park',
      children: [
        {
          key: 11,
          menuName: '人员管理',
          page: { name: '人员管理页', url: '' },
          address: 'New York No. 2 Lake Park'
        },
        {
          key: 12,
          menuName: '组织机构管理',
          page: { name: '组织机构管理页', url: '' },
          address: 'New York No. 3 Lake Park',
          children: [
            {
              key: 121,
              menuName: '系统管理员',
              page: { name: '系统管理员页', url: '' },
              address: 'New York No. 3 Lake Park'
            }
          ]
        },

      ]
    },
  ];

  // 是否显示 添加菜单弹框
  addNavMenuModalOpen = false;
  // 是否显示 编辑菜单弹框
  editNavMenuModalOpen = false;
  //是否显示 选择页面弹框
  pageSelectModalOpen = false;

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  constructor(private modal: NzModalService) { }

  ngOnInit(): void {
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
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
  handleAddModalShow = (): void => {
    this.addNavMenuModalOpen = true;
  }
  // 添加导航菜单模态框 确认
  handleAddOk = (value: any): void => {
    console.log('-----value', value);
    this.addNavMenuModalOpen = false;
  }

  // 添加导航菜单模态框 关闭
  handleAddCancel = (): void => {
    this.addNavMenuModalOpen = false;
  }

  // 显示 编辑导航菜单弹框
  handleEditModalShow = (): void => {
    this.editNavMenuModalOpen = true;
  }
  // 编辑导航菜单模态框 确认
  handleEditOk = (value: any): void => {
    console.log('-----value', value);
    this.editNavMenuModalOpen = false;
  }

  // 编辑导航菜单模态框 关闭
  handleEditCancel = (): void => {
    this.editNavMenuModalOpen = false;
  }

    // 显示 选择页面弹框
    handlePageSelectModalShow = (): void => {
      this.pageSelectModalOpen = true;
    }
    // 选择页面弹框 确认
    handlePageSelectOk = (value: any): void => {
      console.log('-----value', value);
      this.pageSelectModalOpen = false;
    }
  
    // 选择页面弹框 关闭
    handlePageSelectCancel = (): void => {
      this.pageSelectModalOpen = false;
    }

  // 删除菜单
  showMenuDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '<b style="color: red;">你正在删除导航菜单,对应的子菜单也会被删除,确定要删除？</b>',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => console.log('OK'),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

}
