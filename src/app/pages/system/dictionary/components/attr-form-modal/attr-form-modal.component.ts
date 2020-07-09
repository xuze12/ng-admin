import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, Observer } from 'rxjs';

import { MyValidators } from '../../../../utils/validators';


@Component({
  selector: 'app-attr-form-modal',
  templateUrl: './attr-form-modal.component.html',
  styleUrls: ['./attr-form-modal.component.scss']
})
export class AttrFormModalComponent implements OnInit {

  @Input() isVisible: boolean
  @Input() title: string
  @Input() handleOk: any
  @Input() handleCancel: any
  @Input() editData?: any

  validateForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // use `MyValidators`
    const { required, maxLength, minLength, numberAddLetterAddChinese } = MyValidators;

    this.validateForm = this.fb.group({
      name: ['', [required, maxLength(12), minLength(1), numberAddLetterAddChinese]],
      description: ['', [required, maxLength(30), minLength(1), numberAddLetterAddChinese]],
    });

  }

  // 监听父级传值变化
  ngOnChanges(changes: SimpleChanges) {
    const { name=null, description=null } = this.editData || {}
    const { required, maxLength, minLength, numberAddLetterAddChinese } = MyValidators;
    this.validateForm = this.fb.group({
      name: [name, [required, maxLength(12), minLength(1), numberAddLetterAddChinese]],
      description: [description, [required, maxLength(30), minLength(1), numberAddLetterAddChinese]],
    });
  }

  async submitForm(value: { menuName: string; }) {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    console.log(value);
    const data = await this.handleOk(value);

    if (data) {
      this.validateForm.reset();
    }
    // const params = this.validateForm.value;

    // if (this.type === 'edit') {
    //   const edit_roles_info = JSON.parse(window.localStorage.getItem('edit_roles_info') || '{}')
    //   Object.assign(params, { id: edit_roles_info.id || '' })
    //   this.handleEditRoles(params)
    // } else {
    //   this.handleAddRole(params)
    // }
  }

}
