import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.scss']
})
export class DictionaryListComponent implements OnInit {

  listOfData = [
    {
      key: '1',
      name: '机构属性',
      des: '组织机构属性，可在组织管理出进行配置',
    },
    {
      key: '2',
      name: '机构属性',
      des: '组织机构属性，可在组织管理出进行配置',
    },
    {
      key: '3',
      name: '机构属性',
      des: '组织机构属性，可在组织管理出进行配置',
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
