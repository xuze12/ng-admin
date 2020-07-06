
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

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

  static mobile(control: AbstractControl): MyValidationErrors | null {
    const value = control.value;

    if (isEmptyInputValue(value)) {
      return null;
    }

    return isMobile(value) ? null : { mobile: { 'zh-cn': `手机号码格式不正确`, en: `Mobile phone number is not valid` } };
  }

  static numberAddLetter(minLength: number, maxLength: number) {

    return (control: AbstractControl): MyValidationErrors | null => {
      const value = control.value;

      if (isEmptyInputValue(value)) {
        return null;
      }
      console.log(value, '---value')
      console.log(value, minLength, maxLength, '-----isNumberAddLetter(value, minLength, maxLength)')

      return isNumberAddLetter(value, minLength, maxLength) ? null : { mobile: { 'zh-cn': `请输入${minLength}-${maxLength}位数字、字母组合的密码`, en: `Passwordr is not valid` } };
    };
  }


}

function isEmptyInputValue(value: NzSafeAny): boolean {
  return value == null || value.length === 0;
}

function isMobile(value: string): boolean {
  return typeof value === 'string' && /(^1\d{10}$)/.test(value);
}

// 数字、字母组合
function isNumberAddLetter(value: string, minLength: number, maxLength: number): boolean {

  return typeof value === 'string' && new RegExp(`^[a-zA-Z0-9]{${minLength},${maxLength}}$`).test(value);
}
