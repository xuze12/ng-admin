import { Component, OnInit, Input } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

export interface TreeNodeInterface {
  key: string;
  name: string;
  title: string;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-region-tree',
  templateUrl: './region-tree.component.html',
  styleUrls: ['./region-tree.component.scss']
})

export class RegionTreeComponent implements OnInit {

  @Input() organizeList: any = [];
  @Input() handelSearch: any;
  searchValue = '';
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  constructor() { }

  ngOnInit(): void {
  }

  // 转树形结构
  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false, });

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


  // 点击树形每一项
  handelTreeItemClick(event: NzFormatEmitEvent) {
    try {
      if (event.node) {
        const target = event.node.origin;
        this.handelSearch(target, this.searchValue);
      }
    } catch (error) {
      console.log(error, '---')
    }
  }

  /**
   * 搜索
   */
  onSearchChange = (event: NzFormatEmitEvent) => {

    try {

      if (!this.searchValue) {

        setTimeout(() => {
          this.organizeList = JSON.parse(window.localStorage.getItem('organizeList'));
        })
        return;
      }

      const organizeQequestList = JSON.parse(window.localStorage.getItem('organizeQequestList'))
        .filter(item => item.name.includes(this.searchValue));


      this.organizeList.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });

      setTimeout(() => {
        this.organizeList = this.handleOrganizeList(organizeQequestList);
      })

    } catch (error) {
      console.log(error, '---')
    }


  }

}
