import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MyValidators } from '../../utils/validators';

// 转拼音
import pinyin from 'pinyin';

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
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  menuList = [];
  mapOfExpandedMenuList: { [key: string]: TreeNodeInterface[] } = {};
  checkedPowerList = [];
  listOfMapData: TreeNodeInterface[] = [];

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {

    this.getOrganizeList();
    this.getMenuAndPower();

    this.route.params.subscribe(data => {
      this.type = data.type;
      const { required, maxLength, numberAddLetterAddChinese } = MyValidators;
      // 初始化表单
      if (data.type === 'edit') {

        const { name, sign, departmentId } = JSON.parse(window.localStorage.getItem('edit_roles_info') || '{}');
        this.validateForm = this.fb.group({
          name: [name, [required, maxLength(30), numberAddLetterAddChinese]],
          sign: [{ value: sign ? sign : null, disabled: true }, [required]],
          departmentId: [departmentId, [required]],
        });

      } else {
        this.validateForm = this.fb.group({
          name: [null, [required, maxLength(30), numberAddLetterAddChinese]],
          sign: [{ value: null, disabled: true }, [required]],
          departmentId: [null, [required]],
        });
      }
  
    })

    // 初始化操作权限
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
  }

  // 组件销毁钩子函数
  ngOnDestroy() {
    if (this.type === 'edit') {
      window.localStorage.removeItem('edit_roles_info');
    }
  }

  // 监听角色nane改变生成对应的标识
  handleNameChange(value: string) {

    const sign = pinyin(value, { segment: true, style: pinyin.STYLE_NORMAL }).flat().join('');
    this.validateForm.get('sign')!.setValue(sign);
  }

  /**
   * 根据角色di 查找角色页面权限
   * @param id 角色id
   */
  async handleRoleIdGetPower(id: number) {

    const url = `/api/api/permission/role_permission_group_permission/${id}`;

    try {
      const data: any = await this.http.get(url).toPromise()
      return data.code === 200 ? data.data : [];
    } catch (error) {
      console.log(error, '---err')
    }
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {

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
    const target = array.find(a => a.key === data.key)!;
    target.allChecked = $event;
    target.indeterminate = false;
    target.power = target.power.map(item => (
      {
        ...item,
        checked: $event
      }
    ))

    for (let item of target.power) {

      if (item.checked) {
        const hasItem = this.checkedPowerList.find(i => i.id === item.id);
        if (!hasItem) {
          this.checkedPowerList.push(item)
        }

      } else {
        this.checkedPowerList = this.checkedPowerList.filter(i => i.id !== item.id);
      }
    }
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

    for (let item of target.power) {
      if (item.checked) {
        const hasItem = this.checkedPowerList.find(i => i.id === item.id);
        if (!hasItem) {
          this.checkedPowerList.push(item)
        }

      } else {
        this.checkedPowerList = this.checkedPowerList.filter(i => i.id !== item.id);
      }
    }
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
        this.organizeList = this.handleOrganizeList(newData);
        this.organizeList.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
      } else {
        this.organizeList = []
      }

    } catch (error) {
      console.log(error, '---err')
    }
  }

  /**
   * 处理获取机构列表数据 转成树形结构
   */
  handleOrganizeList(array) {
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
   * 获取页面权限列表 以及 页面权限
   */
  async getMenuAndPower() {
    // 角色拥有的权限
    let rolesHasPower = [];

    const pageList = await this.getPagesList();
    this.pagesList = pageList;


    const menuList = await this.getMenuList();

    if (this.type === 'edit') {
      const { id } = JSON.parse(window.localStorage.getItem('edit_roles_info') || '{}');
      rolesHasPower = await this.handleRoleIdGetPower(id);
    }

    for (let item of menuList) {
      let powerGroup = []
      let hasPowerGroup = pageList.filter(i => i.permissionGroupId === item.permissionGroupId);
      let allChecked = false;
      let indeterminate = false;

      if (hasPowerGroup) {
        powerGroup = hasPowerGroup.map(powerItem => Object.assign(powerItem, {
          label: powerItem.permission ? powerItem.permission.description : '',
          value: powerItem.permission ? powerItem.permission.id : '',
          checked: rolesHasPower.find(i => i.permissionGroupPermissionId === powerItem.id) ? true : false
        }))
      }

      for (let item of powerGroup) {
        if (item.checked) {
          this.checkedPowerList.push(item)
        } else {
          this.checkedPowerList = this.checkedPowerList.filter(i => i.id !== item.id);
        }
      }

      if (powerGroup.length > 0) {
        const checkedPower = powerGroup.filter(i => i.checked === true);
        allChecked = checkedPower.length == powerGroup.length;
        item.indeterminate = checkedPower.length > 0 && checkedPower.length < powerGroup.length;
      }

      item.key = item.id;
      item.power = powerGroup;
      item.allChecked = allChecked;
      item.indeterminate = indeterminate;
    }

    this.menuList = this.handleMenuList(menuList);
    this.menuList.forEach(item => {
      this.mapOfExpandedMenuList[item.key] = this.convertTreeToList(item);
    });
  }

  /**
   * 菜单带页面权限列表
   */
  async getMenuList() {
    const url = '/api/api/permission/permission_group_menu/with_permission_group';

    try {
      const data: any = await this.http.get(url).toPromise();
      return data.code === 200 ? data.data : [];
    } catch (error) {
      console.log(error, '---err')
    }
  }

  /**
   * 处理菜单列表数据 转树形结构
   */
  handleMenuList(array) {
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
   */
  async getPagesList() {
    const url = '/api/api/permission/permission_group_permission';

    try {
      const data: any = await this.http.get(url).toPromise();
      return data.code === 200 ? data.data : [];
    } catch (error) {
      console.log(error, '---err')
    }
  }

  //取消
  resetForm(e: MouseEvent): void {

    e.preventDefault();

    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    this.validateForm.reset();
    this.router.navigate(['/admin/roles/list'])
  }

  // 表单提交
  submitForm(): void {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    


    if (!this.validateForm.valid) {
      return;
    }

    // 获取禁止的表单值 getRawValue
    const params = this.validateForm.getRawValue();

    if (this.type === 'edit') {
      const edit_roles_info = JSON.parse(window.localStorage.getItem('edit_roles_info') || '{}');
      Object.assign(params, { id: edit_roles_info.id || '' });
      this.handleEditRoles(params);
    } else {
      this.handleAddRole(params);
    }
  }

  // 提示框
  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  /**
   * 添加角色
   * @param name 角色名称 
   * @param sign 角色标识
   * @param departmentId 权限页面id
   */

  async handleAddRole(params: any) {
    const url = '/api/api/user/role_info';

    try {
      const data: any = await this.http.post(url, params).toPromise();
      const is_error = !(data.code === 200);

      if (is_error) {
        this.createNotification('error', '新增角色', data.message || '新增角色失败！');
        return;
      }

      // 给角色绑定页面权限
      const PermissionGroupPermissionIds = this.checkedPowerList.map(item => item.id).join();

      // if(!PermissionGroupPermissionIds) {
      //   this.createNotification('error', '新增角色', '还未选择绑定页面！');
      // }

      const powerParams = {
        roleInfoId: data.data,
        PermissionGroupPermissionIds: PermissionGroupPermissionIds
      }

      const powerData = await this.handleRolesAddPower(powerParams);

      this.createNotification('success', '新增角色', '新增角色成功！');
      this.validateForm.reset();
      this.router.navigate(['/admin/roles/list']);

    } catch (error) {
      this.createNotification('error', '新增角色', error.message || '新增人员失败！');
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
    const url = '/api/api/user/role_info';

    try {
      const data: any = await this.http.put(url, params).toPromise()
      const is_error = !(data.code === 200)

      // 给角色绑定页面权限
      const PermissionGroupPermissionIds = this.checkedPowerList.map(item => item.id).join();
      const powerParams = {
        roleInfoId: params.id,
        PermissionGroupPermissionIds: PermissionGroupPermissionIds
      }

      const powerData = await this.handleRolesEditPower(powerParams);

      if (is_error) {
        this.createNotification('error', '编辑角色', data.message || '编辑角色失败！')
        return;
      }

      this.createNotification('success', '编辑角色', '编辑角色成功！')
      this.validateForm.reset();
      this.router.navigate(['/admin/roles/list'])

    } catch (error) {
      this.createNotification('error', '编辑角色', error.message || '编辑角色失败！')
    }
  }

  /**
   * 为角色添加页面操作权限
   * @param roleInfoId 角色id
   * @param PermissionGroupPermissionIds 页面权限选项id数组 格式:[id1,id2]
   */
  async handleRolesAddPower(params: any) {

    try {
      const url = '/api/api/permission/role_permission_group_permission';

      const data: any = await this.http.post(url, params).toPromise()
      const is_error = !(data.code === 200)
    } catch (error) {
      console.log(error, '------error---')
    }
  }

  /**
   * 为角色修改页面操作权限
   * @param roleInfoId 角色id
   * @param PermissionGroupPermissionIds 页面权限选项id数组 格式:[id1,id2]
   */
  async handleRolesEditPower(params: any) {

    try {
      const url = '/api/api/permission/role_permission_group_permission';

      const data: any = await this.http.put(url, params).toPromise()
      const is_error = !(data.code === 200)
    } catch (error) {
      console.log(error, '------error---')
    }
  }

}
