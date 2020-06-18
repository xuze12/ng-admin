import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import {Router} from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export interface Data {
  id: number;
  account: string,
  name: string;
  phoneNumber: number;
  gender: string;
  organization: string;
  role: string;
  status: boolean;
  disabled: boolean;
}

@Component({
  selector: 'app-person-right-content',
  templateUrl: './person-right-content.component.html',
  styleUrls: ['./person-right-content.component.scss']
})
export class PersonRightContentComponent implements OnInit {
  value?: string;
  validateForm!: FormGroup;
  isResetVisible: boolean = false;

  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<number>();

  constructor(private fb: FormBuilder, private modal: NzModalService, public router: Router) { }

  ngOnInit(): void {
    this.listOfData = new Array(5).fill(0).map((_, index) => {
      return {
        id: index,
        account: `123456_${index}`,
        name: `胡汉三-${index}`,
        phoneNumber: 13592835212,
        gender: '男',
        organization: `锦绣花园——${index}`,
        role: 'admin',
        status: index % 2 == 0,
        disabled: index % 2 == 0
      };
    });

    // 初始化表单
    this.validateForm = this.fb.group({
      superAdminPassword: [null, [Validators.required]],
      curAdminPassword: [null, [Validators.required]]
    })
  }


  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.filter(({ disabled }) => !disabled).forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    this.loading = true;
    const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.id));
    console.log(requestData);
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loading = false;
    }, 1000);
  }


  // btns
  add(): void {
    console.log('add')
    this.router.navigate(['/person/infoUpdate/', 'add']);
  }
  prohibit(): void {
    console.log('prohibit')
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '<b>禁用管理员后，管理员将不可登录，确定禁用管理员：<i style="color:red;">胡彦斌(123456)</i>？</b>',
      nzOkText: '禁用',
      nzCancelText: '取消',
      nzOnOk: () => console.log('OK')
    });
  }
  edit(): void {
    console.log('edit')
    this.router.navigate(['/person/infoUpdate/', 'edit']);
  }
 
  reset(): void {
    this.isResetVisible = true;
  }

  resetHandleOk(): void {
    console.log('Button ok clicked!');
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log('formdata', this.validateForm.controls)
    this.isResetVisible = false;

  }

  resetHandleCancel(): void {
    console.log('Button cancel clicked!');
    // e.preventDefault();
    this.validateForm.reset();
    this.isResetVisible = false
  }


  delete(): void {
    console.log('delete')
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '<b style="color: red">你正在删除管理员，删除后不可恢复，确定删除？</b>',
      nzOkType: 'danger',
      nzOkText: '删除',
      nzOnOk: () => console.log('OK'),
    });
  }


}