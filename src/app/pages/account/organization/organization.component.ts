import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

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

  listOfMapData: TreeNodeInterface[] = [
    {
      key: `1`,
      name: '广州军区',
      type: '军',
      address: '广州番禺南澳花园',
      children: [
        {
          key: `1-1`,
          name: '黄埔军校',
          type: '师',
          address: '广州番禺南澳花园',
          children: [
            {
              key: `1-1-1`,
              name: '特战旅',
              type: '旅',
              address: '广州番禺南澳花园'
            }
          ]
        },
        {
          key: `1-2`,
          name: '海军战队',
          type: '团',
          address: '广州番禺南澳花园',
        },
        {
          key: `1-3`,
          name: '炮兵连',
          type: '营',
          address: '广州番禺南澳花园'
        }
      ]
    },
    {
      key: `2`,
      name: '北京军区',
      type: '军',
      address: '广州番禺南澳花园'
    }
  ];

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

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


  // modal
  showConfirm(): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '你正在删除机构，删除后不可恢复，确定要删除?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOnOk: () => console.log('OK'),
      nzOnCancel: () => console.log('Cancel')
    });
  }

}
