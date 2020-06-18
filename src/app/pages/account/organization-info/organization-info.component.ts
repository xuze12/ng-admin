import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss']
})
export class OrganizationInfoComponent implements OnInit {
  validateForm!: FormGroup;
  type: string;

  constructor(private fb: FormBuilder, public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {

    console.log(this.route)
    this.route.params.subscribe(data => { 
      console.log(data, '----------data')
      this.type = data.type;
    })
    console.log(this.router)

    // 初始化表单
    this.validateForm = this.fb.group({
      orgNmae: ['', [Validators.required]],
      superior: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      leaderName: [null, [Validators.required]],
      tel: [null, [Validators.required]],
      fax: [null, [Validators.required]],
      address: [null, [Validators.required]],
    });
  }

  // 表单提交
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    // this.validateForm.reset();
  }


  // 更换所属机构
  superiorChange(value: string): void {
    // this.validateForm.get('note')!.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }

  // 更换机构类型
  genderChange(value: string): void {
    // this.validateForm.get('note')!.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }

}