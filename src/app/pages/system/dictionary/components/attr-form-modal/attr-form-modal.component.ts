import { Component, OnInit,Input } from '@angular/core';
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

  validateForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // use `MyValidators`
    const { required, maxLength, minLength, numberAddLetterAddChinese} = MyValidators;
    this.validateForm = this.fb.group({
      menuName: ['', [required, maxLength(12), minLength(6),numberAddLetterAddChinese]],
      des:['', [required, maxLength(30), minLength(1),numberAddLetterAddChinese]],
    });

  }

  submitForm(value: { menuName: string; }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    console.log(value);
    this.handleOk(value)
  }

}
