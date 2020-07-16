import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { MyValidators } from '../../utils/validators';

@Component({
  selector: 'app-person-info-update',
  templateUrl: './person-info-update.component.html',
  styleUrls: ['./person-info-update.component.scss']
})

export class PersonInfoUpdateComponent implements OnInit {
  validateForm!: FormGroup;
  type: string;
  form_data: object;
  expandKeys = [];
  organizeList: any = JSON.parse(window.localStorage.getItem('organizeList') || '[]');
  rolesList = [];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private http: HttpClient,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {

    // 获取角色列表
    this.getRolesList();

    this.route.params.subscribe(data => {
      this.type = data.type;

      const { required, maxLength, mobile: v_mobile, numberAddLetterAddChinese } = MyValidators;

      // 初始化表单
      if (data.type === 'edit') {

        const {
          mobile = null,
          enabled = null,
          departmentId = null,
          name = null,
          nickname = null,
          roleInfoId = null,
          tusers = {},
          sex = null } = JSON.parse(window.localStorage.getItem('edit_user_info') || '{}')

        this.validateForm = this.fb.group({
          username: [tusers.userName, [required, maxLength(30), numberAddLetterAddChinese]],
          mobile: [`${mobile}`, [required, v_mobile]],
          enabled: [tusers.enabled, [required]],
          departmentId: [departmentId, [required]],
          name: [name, [required, maxLength(30), numberAddLetterAddChinese]],
          nickname: [nickname, [required, maxLength(30), numberAddLetterAddChinese]],
          roleInfoId: [roleInfoId, [required]],
          sex: [sex, [required]]
        })
      } else {
        this.validateForm = this.fb.group({
          username: [null, [required, , maxLength(30), numberAddLetterAddChinese]],
          mobile: [null, [required, v_mobile]],
          enabled: [null, [required]],
          departmentId: [null, [required]],
          password: [null, [required, numberAddLetterAddChinese]],
          name: [null, [required, maxLength(30), numberAddLetterAddChinese]],
          nickname: [null, [required, maxLength(30), numberAddLetterAddChinese]],
          roleInfoId: [null, [required]],
          checkPassword: [null, [required, numberAddLetterAddChinese]],
          sex: [null, [required]]
        })
      }

    })
  }

  /**
   * 获取角色列表
   */
  async getRolesList() {

    try {
      const url = '/api/api/user/role_info';

      const data: any = await this.http.get(url).toPromise();

      if (data.code !== 200) {
        this.rolesList = [];
        return;
      }

      this.rolesList = data.data.map((item) => Object.assign(item, { key: item.id })).filter((item) => item.name !== 'ADMIN');

    } catch (error) {
      console.log(error, '---err')
    }
  }

  // 表单提交
  submitForm(): void {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      const params = this.validateForm.value
      if (this.type === 'edit') {
        const edit_user_info = JSON.parse(window.localStorage.getItem('edit_user_info') || '{}')
        Object.assign(params, { id: edit_user_info.userId })
        this.handleEditPerson(params)
      } else {
        this.handleAddPerson(params)
      }
    }
  }
  // 提示框
  createNotification(type: string, title: string, message: string): void {

    this.notification.create(type, title, message);
  }

  /**
   * 新增人员管理
   * @param username 账号
   * @param enabled 账号状态 true 正常 false 禁用
   * @param mobile 手机号
   * @param departmentId 所属机构id
   * @param nickname 昵称
   * @param name 姓名
   * @param roleInfoId 角色id
   * @param sex 性别 1男 2女
   * @param password 用户密码
   * */

  async handleAddPerson(params: any) {

    try {
      const url = '/api/api/user/user';

      const data: any = await this.http.post(url, params).toPromise();

      const is_error = !(data.code === 200)

      if (is_error) {

        this.createNotification('error', '新增人员', data.message || '新增人员失败！');
        return;
      }

      this.createNotification('success', '新增人员', '新增人员成功！');
      this.validateForm.reset();
      this.router.navigate(['/admin/person/list']);

    } catch (error) {
      this.createNotification('error', '新增人员', error.message || '新增人员失败！');
      console.log(error, '---err')
    }
  }

  /**
   * 编辑人员管理
   * @param id 用户userId
   * @param username 账号
   * @param enabled 账号状态 true 正常 false 禁用
   * @param mobile 手机号
   * @param departmentId 所属机构id
   * @param nickname 昵称
   * @param name 姓名
   * @param roleInfoId 角色id
   * @param sex 性别 1男 2女
   * */

  async handleEditPerson(params: any) {

    try {

      const url = '/api/api/user/user';

      const data: any = await this.http.put(url, params).toPromise();

      const is_error = !(data.code === 200);

      if (is_error) {
        this.createNotification('error', '编辑人员', data.message || '编辑人员失败！');
        return;
      }

      this.createNotification('success', '编辑人员', '编辑人员成功！');
      this.validateForm.reset();
      this.router.navigate(['/admin/person/list']);

    } catch (error) {
      this.createNotification('error', '编辑人员', error.message || '编辑人员失败！');
      console.log(error, '---err')
    }
  }


  cancel(e): void {

    e.preventDefault();
    this.validateForm.reset();
    this.router.navigate(['/admin/person/list'])
  }

}
