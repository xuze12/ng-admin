import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { PowerService } from '../../../../services/power.service';
import { MenuService } from '../../../../services/menu.service';
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
  addAttrModalOpen = false;
  editAttrModalOpen = false;
  power = {
    add: false,
    edit: false,
    del: false
  }
  pageMenu=[];

  constructor(
    private modal: NzModalService, 
    public powerService: PowerService,
    public menuService:MenuService,
    ) { }

  ngOnInit(): void {
    this.powerService.setPagePower('dictionary');
    console.log(this.powerService.hasVisitPage, '---hasVisitPage')
    this.power = JSON.parse(window.localStorage.getItem('power') || '{}');

    if (this.powerService.hasVisitPage) {

      this.getPageMenu();
      console.log(this.menuService.pageMenu,'----this.menuService.pageMenu')
      // this.getMenuList();
    }
  }

  // 延迟获取pageHeader 值
  getPageMenu() {
   setTimeout(() => {
      this.pageMenu = this.menuService.pageMenu;
    },400)
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
