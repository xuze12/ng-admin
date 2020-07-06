import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyValidators } from '../../../utils/validators';

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

  @Input() personList: any = [];
  @Input() handleProhibitUserModalShow: any;
  @Input() handleDeleteUserModalShow: any;
  @Input() handleResetUserPassword: any

  value?: string;
  validateForm!: FormGroup;
  isResetVisible: boolean = false;

  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<number>();

  activeUserItem = null;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    public router: Router) { }

  ngOnInit(): void {

    const { required, numberAddLetter } = MyValidators;
    // 初始化表单
    this.validateForm = this.fb.group({
      adminPassword: [null, [required]],
      password: [null, [required, numberAddLetter(8, 16)]]
    })
  }

  // 监听父级传值变化
  ngOnChanges(changes: SimpleChanges) {
    this.personList = this.personList
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

  // 禁止用户
  prohibitUser(item: any) {
    this.handleProhibitUserModalShow(item)
  }

  // btns
  add(): void {
    console.log('add')
    this.router.navigate(['/admin/person/infoUpdate/', 'add']);
  }

  // 编辑 用户信息
  edit(item: any): void {
    window.localStorage.setItem('edit_user_info', JSON.stringify(item))
    this.router.navigate(['/admin/person/infoUpdate/', 'edit']);
  }

  // 显示重置密码弹框
  handleResetMoadlShow(item: any): void {
    this.activeUserItem = item;
    this.isResetVisible = true;
  }

  resetUserPassword(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const params = Object.assign(
      this.validateForm.value,
      { id: this.activeUserItem.userId }
    )
    this.handleResetUserPassword(params)
    this.isResetVisible = false;
  }

  // 关闭重置密码弹框
  handleResetMoadlHide(): void {
    console.log('Button cancel clicked!');
    // e.preventDefault();
    this.validateForm.reset();
    this.isResetVisible = false
  }

  // 删除用户弹框显示
  handleDelete(item: any) {
    this.handleDeleteUserModalShow(item);
  }

}