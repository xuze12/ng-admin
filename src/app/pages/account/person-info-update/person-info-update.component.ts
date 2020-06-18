import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'


@Component({
  selector: 'app-person-info-update',
  templateUrl: './person-info-update.component.html',
  styleUrls: ['./person-info-update.component.scss']
})
export class PersonInfoUpdateComponent implements OnInit {
  validateForm!: FormGroup;
  type: string;
  form_data: object;

  constructor(private fb: FormBuilder, public router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      console.log(data, '-------------------app-person-info-update');
      this.type = data.type;

      // 初始化表单
      if (data.type === 'add') {
        this.validateForm = this.fb.group({
          account: [null, [Validators.required]],
          phoneNumber: [null, [Validators.required]],
          accountStatus: [null, [Validators.required]],
          type: [null, [Validators.required]],
          password: [null, [Validators.required]],
          name: [null, [Validators.required]],
          nickname: [null, [Validators.required]],
          role: [null, [Validators.required]],
          checkPassword: [null, [Validators.required]],
          gender: [null, Validators.required]
        })
      }else {
        this.validateForm = this.fb.group({
          account: [null, [Validators.required]],
          phoneNumber: [null, [Validators.required]],
          accountStatus: [null, [Validators.required]],
          type: [null, [Validators.required]],
          name: [null, [Validators.required]],
          nickname: [null, [Validators.required]],
          role: [null, [Validators.required]],
          gender: [null, Validators.required]
        })
      }
    })
  }

  
  // 表单提交
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log('formdata', this.validateForm.controls)
    // this.validateForm.reset();
  }

  cancel(e): void {
    e.preventDefault();
    this.validateForm.reset();
    this.router.navigate(['/admin/person'])
  }


  // 账号状态选择
  accountStatusChange(value: string): void {
    // this.validateForm.get('note')!.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }

  // 所属机构类型选择
  typeChange(value: string): void {
    // this.validateForm.get('note')!.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }
  // 更换机构类型
  roleChange(value: string): void {
    // this.validateForm.get('note')!.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }
  // 性别类型选择
  genderChange(value: string): void {
    // this.validateForm.get('note')!.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }


}
