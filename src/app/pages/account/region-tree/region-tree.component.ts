import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-region-tree',
  templateUrl: './region-tree.component.html',
  styleUrls: ['./region-tree.component.scss']
})
export class RegionTreeComponent implements OnInit {
  searchValue = '';

  nodes = [
    {
      title: '广州军区',
      key: '0-0',
      children: [
        {
          title: '广州营区',
          key: '0-0-0',
          children: [
            { title: '海军战队', key: '0-0-0-0', isLeaf: true },
            { title: '炮兵连', key: '0-0-0-1', isLeaf: true }
          ]
        },
      ]
    },
    {
      title: '北京军区',
      key: '0-1',
      children: [
        { title: '炮兵连', key: '0-1-0-0', isLeaf: true },
      ]
    },
    {
      title: '兰州军区',
      key: '0-2',
      children: [
        { title: '特战旅', key: '0-1-0-0', isLeaf: true },
      ]
    }
  ];

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
