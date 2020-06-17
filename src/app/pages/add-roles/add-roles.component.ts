import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface TreeNodeInterface {
  key: number;
  name: string;
  age?: number;
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
      age: 60,
      children: [
        {
          key: 11,
          name: '转账给企业用户',
          age: 42,
        },
        {
          key: 12,
          name: '转账给个人账户',
          age: 30,
          children: [
            {
              key: 121,
              name: 'Jimmy Brown',
              age: 16,
            }
          ]
        },
        {
          key: 13,
          name: 'Jim Green sr.',
          age: 72,
          children: [
            {
              key: 131,
              name: 'Jim Green',
              age: 42,
              children: [
                {
                  key: 1311,
                  name: 'Jim Green jr.',
                  age: 25,
                },
                {
                  key: 1312,
                  name: 'Jimmy Green sr.',
                  age: 18,
                }
              ]
            }
          ]
        }
      ]
    },
    {
      key: 2,
      name: 'Joe Black',
      age: 32,
    }
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  constructor(private fb: FormBuilder,private router: Router) { }

  ngOnInit(): void {
    // 初始化表单
    this.validateForm = this.fb.group({
      rolesNmae: ['', [Validators.required]],
      group:[null, [Validators.required]],
      department:[null, [Validators.required]],
      team:[null, [Validators.required]],
      gender: [null, [Validators.required]]
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
    console.log('1212')
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


}
