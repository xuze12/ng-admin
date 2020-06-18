import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface TreeNodeInterface {
  key: number;
  name: string;
  des?: string;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-dictionary-attr',
  templateUrl: './dictionary-attr.component.html',
  styleUrls: ['./dictionary-attr.component.scss']
})
export class DictionaryAttrComponent implements OnInit {
  listOfMapData: TreeNodeInterface[] = [
    {
      key: 1,
      name: '军',
      des: '组织机构属性，可在组织管理出进行配置',
      children: [

        {
          key: 12,
          name: '师',
          des: '组织机构属性，可在组织管理出进行配置',
          children: [
            {
              key: 121,
              name: '团',
              des: '组织机构属性，可在组织管理出进行配置',
            }
          ]
        },

      ]
    },

  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  addAttrModalOpen = false
  editAttrModalOpen = false

  constructor(private modal: NzModalService) { }

  ngOnInit(): void {
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });

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

  // 显示 添加属性弹框
  handleAddAttrModalShow = (): void => {
    this.addAttrModalOpen = true;
  }
  // 添加属性弹框 确认
  handleAddAttrOk = (value: any): void => {
    console.log('-----value', value);
    this.addAttrModalOpen = false;
  }

  // 添加属性弹框 关闭
  handleAddAttrCancel = (): void => {
    this.addAttrModalOpen = false;
  }

  // 显示 编辑属性弹框
  handleEditAttrModalShow = (): void => {
    this.editAttrModalOpen = true;
  }
  // 编辑属性弹框 确认
  handleEditAttrOk = (value: any): void => {
    console.log('-----value', value);
    this.editAttrModalOpen = false;
  }

  // 编辑属性弹框 关闭
  handleEditAttrCancel = (): void => {
    this.editAttrModalOpen = false;
  }

  // 删除属性
  showMenuDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '<b style="color: red;">你正在删除字段,删除后无法恢复,确定要删除？</b>',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => console.log('OK'),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

}
