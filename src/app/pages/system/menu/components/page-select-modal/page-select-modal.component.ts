import { Component, OnInit, Input ,SimpleChanges} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
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
  @Input() pageId?: number
  @Input() handleOk: any
  @Input() handleCancel: any

  validateForm: FormGroup;

  pagesList = []


  constructor(private fb: FormBuilder, private http: HttpClient,) { }

  ngOnInit(): void {

    this.validateForm = this.fb.group({
      menuName: ['',],
      radioValue: [null, [Validators.required]],
    });
    this.getPagesList();
    this.validateForm.reset();
  }

   // 监听父级传值变化
   ngOnChanges(changes: SimpleChanges) {
    console.log(this.pageId,'------pageId')
    this.validateForm = this.fb.group({
      menuName: ['',],
      radioValue: [this.pageId, [Validators.required]],
    });
  }

  /**
 * 获取权限页面列表
 */
  async getPagesList() {
    const url = '/api/api/permission/permission_group'

    try {
      const data: any = await this.http.get(url).toPromise()
      console.log(data, 'getMenuList')
      if (data.code === 200) {
        this.pagesList = data.data.map((item) => Object.assign(item, { key: item.id, show: true }))
        console.log(this.pagesList, '-----getPagesList')
      } else {
        this.pagesList = []
      }

    } catch (error) {
      console.log(error, '---err')
    }
  }

  // 模拟搜索
  handleSearchChange(value) {
    console.log(value, '---value')
    if (value) {
      this.pagesList = this.pagesList.map(item => {
        item.show = item.name.indexOf(value) !== -1
        return item
      })
      console.log(this.pagesList,'---this.pagesList')
      return;
    }

    this.pagesList = this.pagesList.map(item => {
      item.show = true
      return item
    })
    console.log(this.pagesList,'---this.pagesList')
  }

  submitForm(value: { menuName: string; }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
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
