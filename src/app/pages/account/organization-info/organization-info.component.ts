import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpParams } from '@angular/common/http'
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
// import { async } from '@angular/core/testing';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { MyValidators } from '../../utils/validators';


@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss']
})
export class OrganizationInfoComponent implements OnInit {
  validateForm!: FormGroup;
  type: string;

  organizeList: any = [
    {
      title: '顶级机构',
      value: '0',
      key: '0',
      children: [...JSON.parse(window.localStorage.getItem('organizeList') || '[]')]
    },
  ];


  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private notification: NzNotificationService
  ) {

  }

  ngOnInit(): void {


    this.route.params.subscribe(data => {

      this.type = data.type;

      let name = '', parentId = '', type = '', chargePerson = '', mobile = '', fax = '', address = '';

      if (data.type === 'update') {
        const organiza_item = JSON.parse(window.localStorage.getItem('organiza-item') || '{}')

        name = organiza_item.name || '';
        parentId = `${organiza_item.parentId}`
        type = `${organiza_item.type}` || '';
        chargePerson = organiza_item.chargePerson || '';
        mobile = `${organiza_item.mobile}` || '';
        fax = organiza_item.fax || '';
        address = organiza_item.address || '';
      }
      const { required, maxLength, mobile: v_mobile,fax:v_fax } = MyValidators;
      // 初始化表单
      this.validateForm = this.fb.group({
        name: [name, [required, maxLength(30)]],
        parentId: [parentId, [required]],
        type: [type, [required]],
        chargePerson: [chargePerson, [required, maxLength(30)]],
        mobile: [mobile, [required, v_mobile]],
        fax: [fax, [required, v_fax]],
        address: [address, [required, maxLength(100)]],
      });
    })


  }

  /**
   * 递归获取父级ID
   * @param item 
   * 
   * */
  handleGetParentId(item: any, array: any) {

    array.push(`${item.parentId}`)
    if (item.parent) {
      this.handleGetParentId(item.parent, array)
    }
  }

  /**
   * 获取上级机构列表
   * @params parentId 父级 id
   * 
   * */

  async getParentOrganizeList(parentId) {
    const url = '/api/api/user/department'
    const options = {
      params: new HttpParams().set('parentId', parentId)
    }
    try {
      const data: any = await this.http.get(url, options).toPromise()
      console.log(data, 'getParentOrganizationList')

      return data.data

      // const hasData =  data&&typeof data === 'object'&& Reflect.has(data,'code')
    } catch (error) {
      console.log(error, '---err')
      return [];
    }
  }

  // 提示框
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  /**
   * 添加组织
   * @param name 组织名称
   * @param parentId [] 上级机构id
   * @param type 类型
   * @param chargePerson 负责人
   * @param mobile 手机号
   * @param fax 传真
   * @param address 地址
   * */
  async handleAddOrganiza(params: any) {
    const url = '/api/api/user/department'

    try {
      const data: any = await this.http.post(url, params).toPromise()
      console.log(data, 'add')
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '添加失败', '添加组织失败！')
        return;
      }

      this.createNotification('success', '添加成功', '添加组织成功！')
      this.validateForm.reset();

      this.router.navigate(['/admin/organization/list'])

    } catch (error) {
      this.createNotification('error', '添加失败', '添加组织失败！')
      console.log(error, '---err')
    }
  }

  /**
  * 添加组织
  * @param name 组织名称
  * @param parentId [] 上级机构id
  * @param type 类型
  * @param chargePerson 负责人
  * @param mobile 手机号
  * @param fax 传真
  * @param address 地址
  * */
  async handleEditOrganiza(params: any) {

    try {

      const organiza_item = JSON.parse(window.localStorage.getItem('organiza-item') || '{}')
      Object.assign(params, { id: organiza_item.id })
      const url = '/api/api/user/department'

      const data: any = await this.http.put(url, params).toPromise()
      console.log(data, 'add')
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '更新失败', '更新组织失败！')
        return;
      }

      this.createNotification('success', '更新成功', '更新组织成功！')
      this.validateForm.reset();

      this.router.navigate(['/admin/organization/list'])

    } catch (error) {
      this.createNotification('error', '更新失败', '更新组织失败！')
      console.log(error, '---err')
    }
  }

  // 表单提交
  async submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {

      const params = this.validateForm.value
      if (this.type === 'update') {
        this.handleEditOrganiza(params)
      } else {
        this.handleAddOrganiza(params)
      }
    }
  }

  onExpandChange(e: NzFormatEmitEvent): void {
    const node = e.node;
    console.log(node, '---node')
    const parentId = node.origin.value
    if (node && node.getChildren().length === 0 && node.isExpanded) {

      this.loadNode(parentId).then(data => {
        node.addChildren(data);
      });
    }
  }

  async loadNode(parentId): Promise<NzTreeNodeOptions[]> {
    const data = await this.getParentOrganizeList(parentId);
    const children = data.map(item => {
      return {
        title: item.name,
        key: `${item.id}`,
        value: `${item.id}`,
        id: item.id
      }
    })
    return new Promise(resolve => {
      resolve(children)
    });
  }

}