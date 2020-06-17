import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss']
})
export class AddRolesComponent implements OnInit {

  validateForm: FormGroup;

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
      children: [
        {
          key: 11,
          name: '转账给企业用户',
          allChecked: false,
          indeterminate: true,
          power: [
            { label: '新建', value: '新建', checked: true },
            { label: '修改', value: '修改', checked: false },
            { label: '删除', value: '删除', checked: false }
          ],
        },
        {
          key: 12,
          name: '转账给个人账户',
          allChecked: false,
          indeterminate: true,
          power: [
            { label: '新建', value: '新建', checked: true },
            { label: '修改', value: '修改', checked: false },
            { label: '删除', value: '删除', checked: false }
          ],
        },
      ]
    },

  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};


  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    // 初始化表单
    this.validateForm = this.fb.group({
      rolesNmae: ['', [Validators.required]],
      group: [null, [Validators.required]],
      department: [null, [Validators.required]],
      team: [null, [Validators.required]],
      gender: [null, [Validators.required]],
    });

    // 初始化操作权限
    this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
  }

  //取消
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    this.router.navigate(['/roles'])
  }

  // 表单提交
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm,'========validateForm')
    console.log(this.listOfMapData,'-------listOfMapData')
  }


  // 更换集团
  groupChange(value: string): void {
    // this.validateForm.get('note')!.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }

  // 更换部门
  departmentChange(value: string): void {
    // this.validateForm.get('note')!.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }

  // 更换班
  teamChange(value: string): void {
    // this.validateForm.get('note')!.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
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
