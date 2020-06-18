import { Component, OnInit, Input } from '@angular/core';

import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-page-select-modal',
  templateUrl: './page-select-modal.component.html',
  styleUrls: ['./page-select-modal.component.scss']
})
export class PageSelectModalComponent implements OnInit {


  @Input() isVisible: boolean
  @Input() title: string
  @Input() handleOk: any
  @Input() handleCancel: any

  validateForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // use `MyValidators`
    const { required, maxLength, minLength, } = MyValidators;
    this.validateForm = this.fb.group({
      menuName: ['', [required, maxLength(12), minLength(6)], [this.menuNameAsyncValidator]],
      radioValue:['人员管理页', [required]],
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

  menuNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<MyValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({
            duplicated: { 'zh-cn': `用户名已存在`, en: `The menuname is redundant!` }
          });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

}



// current locale is key of the MyErrorsOptions
export type MyErrorsOptions = { 'zh-cn': string; en: string } & Record<string, NzSafeAny>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class MyValidators extends Validators {
  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return { minlength: { 'zh-cn': `最小长度为 ${minLength}`, en: `MinLength is ${minLength}` } };
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return { maxlength: { 'zh-cn': `最大长度为 ${maxLength}`, en: `MaxLength is ${maxLength}` } };
    };
  }

}

// function isEmptyInputValue(value: NzSafeAny): boolean {
//   return value == null || value.length === 0;
// }
