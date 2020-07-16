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
  @Input() handleResetUserPassword: any;
  @Input() power;
  searchValue?: string;
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
    this.validateForm = this.fb.group({
      adminPassword: [null, [required]],
      password: [null, [required, numberAddLetter(8, 16)]]
    })
  }

  // 监听父级传值变化
  ngOnChanges(changes: SimpleChanges) {
    this.personList = this.personList
  }

  onCurrentPageDataChange(listOfCurrentPageData: Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
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

    if (!this.validateForm.valid) {
      console.log(this.validateForm.value,'-------!this.validateForm.valid')
      return;
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

  /**
   * 搜索
   */
  handelSearch() {
    try {

      const personList = JSON.parse(window.localStorage.getItem('personList')).filter(item => item.tusers.userName.includes(this.searchValue));
      this.personList = personList;
      // this.searchValue = '';
    } catch (error) {
      console.log(error, '---')
    }
  }

  /**
   * 搜索onchange事件
   */
  onSearchChange(value: string) {
    if (!value) {
      this.personList = JSON.parse(window.localStorage.getItem('personList'));
    }
  }

  /**
   * 重置onchange事件
   */
  resetSearch() {
    this.searchValue = '';
    this.personList = JSON.parse(window.localStorage.getItem('personList'));
  }

}