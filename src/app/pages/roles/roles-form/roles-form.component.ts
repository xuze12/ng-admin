import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http'
import { NzNotificationService } from 'ng-zorro-antd/notification';

export interface TreeNodeInterface {
  key: number;
  name: string;
  power?: any;
  allChecked?: boolean;
  indeterminate?: boolean;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}


@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent implements OnInit {

  validateForm: FormGroup;
  pagesList: any = [];
  type: string = 'add';
  organizeList: TreeNodeInterface[] = [];

  listOfMapData: TreeNodeInterface[] = [
    {
      key: 1,
      name: '转账',
      power: [
        { label: '新建', value: '新建', checked: true },
        { label: '修改', value: '修改', checked: false },
        { label: '删除', value: '删除', checked: false }
      ],
      allChecked: false,
      indeterminate: true,

    },
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {

    this.getOrganizeList();
    this.getPagesList()


    this.route.params.subscribe(data => {
      this.type = data.type;

      // 初始化表单
      if (data.type === 'edit') {

        const { name, sign, departmentId } = JSON.parse(window.localStorage.getItem('edit_roles_info') || '{}')
        console.log(departmentId,'---departmentId')
        // 初始化表单
        this.validateForm = this.fb.group({
          name: [name, [Validators.required]],
          sign: [sign, [Validators.required]],
          departmentId: [departmentId, [Validators.required]],
        });
      } else {
        // 初始化表单
        this.validateForm = this.fb.group({
          name: ['', [Validators.required]],
          sign: [null, [Validators.required]],
          departmentId: [null, [Validators.required]],
        });
      }
    })


    // 初始化操作权限
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
  }

  /**
  * 获取机构列表
  * */
  async getOrganizeList() {
    const url = '/api/api/user/department'

    try {
      const data: any = await this.http.get(url).toPromise()
      console.log(data, 'getOrganizeList')

      if (data.code === 200) {
        const newData = data.data.map((item) => Object.assign(item, { key: item.id, title: item.name }))
        const list = this.handleOrganizeList(newData);
        this.organizeList = list
        this.organizeList.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
      } else {
        this.organizeList = []
      }

      // window.localStorage.setItem('organizeList', JSON.stringify(this.organizeList))

    } catch (error) {
      console.log(error, '---err')
    }
  }

  /**
   * 处理获取机构列表数据 转成树形结构
   */
  handleOrganizeList(array) {
    const list = [];
    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    const map = {};
    for (let i = 0; i < array.length; i++) {
      map[array[i].id] = array[i]
    }
    var val = [];
    array.forEach(function (item) {
      // 以当前遍历项，的pid,去map对象中找到索引的id
      var parent = map[item.parentId];
      // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    });
    return val;
  }

  /**
   * 获取权限页面列表
   * */
  async getPagesList() {
    const url = '/api/api/permission/permission_group_permission'

    try {
      const data: any = await this.http.get(url).toPromise()

      if (data.code === 200) {
        const newData = data.data.map((item) => Object.assign(item, {
          key: item.id,
          newId: item.permission.id,
          title: item.permission.name,
          parentId: item.permissionGroupId
        }))
        const list = this.handlePagesList(newData);
        this.pagesList = list
        console.log(this.pagesList, '----getPagesList----list')
        this.pagesList.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
      } else {
        this.pagesList = []
      }

    } catch (error) {
      console.log(error, '---err')
    }
  }

  /**
   * 处理获权限页面列表数据 转成树形结构
   */
  handlePagesList(array) {
    const list = [];
    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    const map = {};
    for (let i = 0; i < array.length; i++) {
      map[array[i].permissionGroupId] = array[i]
    }
    console.log(map, '---map')
    var val = [];
    array.forEach(function (item) {
      // 以当前遍历项，的parentId,去map对象中找到索引的id
      var parent = map[item.permissionGroup.parentId];
      console.log(parent, '----parent')
      // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    });
    console.log(val, '------val---')
    return val;
  }

  //取消
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    this.router.navigate(['/admin/roles/list'])
  }

  // 表单提交
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm, '========validateForm')
    const params = this.validateForm.value
    if (this.type === 'edit') {
      const edit_roles_info = JSON.parse(window.localStorage.getItem('edit_roles_info') || '{}')
      Object.assign(params, { id: edit_roles_info.id })
      this.handleEditRoles(params)
    } else {
      this.handleAddRole(params)
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
   * 添加角色
   * @param name 角色名称 
   * @param sign 角色标识
   * @param departmentId 权限页面id
   */

  async handleAddRole(params: any) {
    const url = '/api/api/user/role_info'

    try {
      const data: any = await this.http.post(url, params).toPromise()
      console.log(data, 'add')
      const is_error = !(data.code === 200)

      if (is_error) {

        this.createNotification('error', '新增角色', data.msg || '新增角色失败！')
        return;
      }

      this.createNotification('success', '新增角色', '新增角色成功！')
      this.validateForm.reset();
      this.router.navigate(['/admin/roles/list'])

    } catch (error) {
      this.createNotification('error', '新增角色', '新增人员失败！')
      console.log(error, '---err')
    }
  }

  /**
   * 编辑角色
   * @param id 角色id
   * @param name 角色名称 
   * @param sign 角色标识
   * @param departmentId 权限页面id
  * */

  async handleEditRoles(params: any) {
    const url = '/api/api/user/role_info'

    try {
      const data: any = await this.http.put(url, params).toPromise()
      console.log(data, 'handleEditPerson')
      const is_error = !(data.code === 200)

      if (is_error) {
        this.createNotification('error', '编辑角色', '编辑角色失败！')
        return;
      }

      this.createNotification('success', '编辑角色', '编辑角色成功！')
      this.validateForm.reset();

      this.router.navigate(['/admin/roles/list'])

    } catch (error) {
      this.createNotification('error', '编辑角色', '编辑角色失败！')
      console.log(error, '---err')
    }
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    console.log(array, '-------array')
    console.log(data, '-------data')
    console.log($event, '-------$event')
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  // 全选
  updateAllChecked(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    console.log(array, '-------array', data, '-------data', $event, '-------$event')
    const target = array.find(a => a.key === data.key)!;
    target.allChecked = $event;
    target.indeterminate = false;
    target.power = target.power.map(item => (
      {
        ...item,
        checked: $event
      }
    ))

  }

  // 更新选中的
  updateSingleChecked(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {

    const target = array.find(a => a.key === data.key)!;

    if (target.power.every(item => !item.checked)) {
      target.allChecked = false;
      target.indeterminate = false;
    } else if (target.power.every(item => item.checked)) {
      target.allChecked = true;
      target.indeterminate = false;
    } else {
      target.indeterminate = true;
    }
  }


}
