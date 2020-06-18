import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';



interface ItemData {
  id: number;
  name: string;
  mechanism: string;
  authority: string;
}



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: ItemData[] = [];
  listOfData: ItemData[] = [];
  setOfCheckedId = new Set<number>();

  constructor(private modal: NzModalService) { }

  ngOnInit() {

    this.listOfData = new Array(20).fill(0).map((_, index) => {
      return {
        id: index,
        name: '炊管人员',
        mechanism: '广州军区/后勤部',
        authority: '人员管理/新建,编辑,删除、组织结构管理/新建,编辑,删除、角色管理/新建,编辑,删除'
      };
    });
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '<b style="color: red;">你正在删除角色,删除后不可恢复,你确定要删除？</b>',
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => console.log('OK'),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

}
