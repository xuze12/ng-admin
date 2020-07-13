import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpParams } from '@angular/common/http'

import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
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
  dictionaryList = [];
  organizeList: any = [
    {
      title: '顶级机构',
      value: 0,
      key: 0,
      children: [...JSON.parse(window.localStorage.getItem('organizeList') || '[]')]
    },
  ];

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {

    this.getDictionaryList();

    this.route.params.subscribe(data => {

      this.type = data.type;

      let name = null, parentId = null, type = null, chargePerson = null, mobile = null, fax = null, address = null;

      if (data.type === 'update') {
        const organiza_item = JSON.parse(window.localStorage.getItem('organiza-item') || '{}')
        name = organiza_item.name || null;
        parentId = organiza_item.parentId || 0
        type = organiza_item.type || null;
        chargePerson = organiza_item.chargePerson || null;
        mobile = `${organiza_item.mobile}` || null;
        fax = organiza_item.fax || null;
        address = organiza_item.address || null;
      }

      const { required, maxLength, mobile: v_mobile, fax: v_fax, numberAddLetterAddChinese } = MyValidators;
      // 初始化表单
      this.validateForm = this.fb.group({
        name: [name, [required, maxLength(30), numberAddLetterAddChinese]],
        parentId: [parentId, [required]],
        type: [type, [required]],
        chargePerson: [chargePerson, [required, maxLength(30), numberAddLetterAddChinese]],
        mobile: [mobile, [required, v_mobile]],
        fax: [fax, [v_fax]],
        address: [address, [maxLength(100), numberAddLetterAddChinese]],
      });
    })
  }

  /**
   * 递归获取父级ID
   * @param item 
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
   * */

  async getParentOrganizeList(parentId) {

    const url = '/api/api/user/department';
    const options = {
      params: new HttpParams().set('parentId', parentId)
    }

    try {
      const data: any = await this.http.get(url, options).toPromise()
      return data.data
    } catch (error) {
      console.log(error, '---err')
      return [];
    }
  }


  /**
  * 获取机构字典列表
  * @param department_type 目前固定写死
  * */
  async getDictionaryList() {
    try {

      const url = '/api/api/user/dictionary/key/department_type';

      const data: any = await this.http.get(url).toPromise();

      if (data.code !== 200) {
        this.dictionaryList = [];
        return;
      }

      this.dictionaryList = data.data.map(item => Object.assign(item, { key: item.id, key1: item.key, title: item.name }));

    } catch (error) {
      console.log(error, '---')
      this.dictionaryList = [];
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

    try {
      const url = '/api/api/user/department';

      const data: any = await this.http.post(url, params).toPromise();
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '添加失败', data.message || '添加组织失败！');
        return;
      }

      this.createNotification('success', '添加成功', '添加组织成功！');
      this.validateForm.reset();
      this.router.navigate(['/admin/organization/list']);

    } catch (error) {
      this.createNotification('error', '添加失败', error.message || '添加组织失败！');
      console.log(error, '---err')
    }
  }

  /**
  * 更新组织
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

      const organiza_item = JSON.parse(window.localStorage.getItem('organiza-item') || '{}');
      Object.assign(params, { id: organiza_item.id })
      const url = '/api/api/user/department'

      const data: any = await this.http.put(url, params).toPromise();

      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '更新失败', data.message || '更新组织失败！')
        return;
      }

      this.createNotification('success', '更新成功', '更新组织成功！');
      this.validateForm.reset();
      this.router.navigate(['/admin/organization/list']);

    } catch (error) {
      this.createNotification('error', '更新失败', error.message || '更新组织失败！')
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