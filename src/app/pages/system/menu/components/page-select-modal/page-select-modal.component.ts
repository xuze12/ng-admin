import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http'
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
      menuName: [null],
      radioValue: [null, [Validators.required]],
    });

    this.getPagesList();
    this.validateForm.reset();
  }

  // 监听父级传值变化
  ngOnChanges(changes: SimpleChanges) {

    this.validateForm = this.fb.group({
      menuName: ['',],
      radioValue: [this.pageId, [Validators.required]],
    });
  }

  /**
   * 获取权限页面列表
   */
  async getPagesList() {

    try {

      const url = '/api/api/permission/permission_group';

      const data: any = await this.http.get(url).toPromise();

      let pagesList = [];
      if (data.code === 200) {
        pagesList = data.data.map((item) => Object.assign(item, { key: item.id, show: true }))
      }

      this.pagesList = pagesList;
    } catch (error) {
      console.log(error, '---err')
    }
  }

  // 模拟搜索
  handleSearchChange(value) {

    if (value) {
      this.pagesList = this.pagesList.map(item => {
        item.show = item.name.indexOf(value) !== -1
        return item
      })
      return;
    }

    this.pagesList = this.pagesList.map(item => {
      item.show = true
      return item
    })
  }

  submitForm(value: { menuName: string; }): void {

    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    this.handleOk(value)
  }

}
