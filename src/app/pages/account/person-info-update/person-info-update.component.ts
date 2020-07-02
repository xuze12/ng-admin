import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpParams } from '@angular/common/http'
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
          username: [tusers.userName, [Validators.required]],
          mobile: [mobile, [Validators.required]],
          enabled: [tusers.enabled, [Validators.required]],
          departmentId: [departmentId, [Validators.required]],
          name: [name, [Validators.required]],
          nickname: [nickname, [Validators.required]],
          roleInfoId: [roleInfoId, [Validators.required]],
          sex: [sex, Validators.required]
        })
      } else {
        this.validateForm = this.fb.group({
          username: [null, [Validators.required]],
          mobile: [null, [Validators.required]],
          enabled: [null, [Validators.required]],
          departmentId: [null, [Validators.required]],
          password: [null, [Validators.required]],
          name: [null, [Validators.required]],
          nickname: [null, [Validators.required]],
          roleInfoId: [null, [Validators.required]],
          checkPassword: [null, [Validators.required]],
          sex: [null, Validators.required]
        })
      }

    })
  }

  /**
   * 获取角色列表
   */
  async getRolesList() {
    const url = '/api/api/user/role_info'
    try {
      const data: any = await this.http.get(url).toPromise()
      console.log(data, 'getOrganizeList')

      if (data.code === 200) {
        const newData = data.data.map((item) => Object.assign(item, { key: item.id }))
        this.rolesList = newData

      } else {
        this.rolesList = []
      }

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
    console.log('formdata', this.validateForm.value)
    // this.validateForm.reset();
    const params = this.validateForm.value
    if (this.type === 'edit') {
      const edit_user_info = JSON.parse(window.localStorage.getItem('edit_user_info') || '{}')
      Object.assign(params, { id: edit_user_info.userId })
      this.handleEditPerson(params)
    } else {
      this.handleAddPerson(params)
    }
  }
  // 提示框
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(
      type,
      title,
      message
    );
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
    const url = '/api/api/user/user'

    try {
      const data: any = await this.http.post(url, params).toPromise()
      console.log(data, 'add')
      const is_error = !(data.code === 200)

      if (is_error) {

        this.createNotification('error', '新增人员', data.msg || '新增人员失败！')
        return;
      }

      this.createNotification('success', '新增人员', '新增人员成功！')
      this.validateForm.reset();

      this.router.navigate(['/admin/person'])

    } catch (error) {
      this.createNotification('error', '新增人员', '新增人员失败！')
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
    const url = '/api/api/user/user'

    try {
      const data: any = await this.http.put(url, params).toPromise()
      console.log(data, 'handleEditPerson')
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '编辑人员', '编辑人员失败！')
        return;
      }

      this.createNotification('success', '编辑人员', '编辑人员成功！')
      this.validateForm.reset();

      this.router.navigate(['/admin/person'])

    } catch (error) {
      this.createNotification('error', '编辑人员', '编辑人员失败！')
      console.log(error, '---err')
    }
  }


  cancel(e): void {
    e.preventDefault();
    this.validateForm.reset();
    this.router.navigate(['/admin/person'])
  }

}
