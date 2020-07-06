import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
// import { Observable, Observer } from 'rxjs';
import { MyValidators } from '../../../../utils/validators';


@Component({
  selector: 'app-menu-form-modal',
  templateUrl: './menu-form-modal.component.html',
  styleUrls: ['./menu-form-modal.component.scss']
})

export class MenuFormModalComponent implements OnInit {

  @Input() isVisible: boolean
  @Input() title: string
  @Input() handleOk: any
  @Input() handleCancel: any
  @Input() menuName?: string

  validateForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const { required, maxLength, minLength } = MyValidators;
    this.validateForm = this.fb.group({
      menuName: [null, [required, maxLength(30), minLength(1)]],
    });
  }

  // 监听父级传值变化
  ngOnChanges(changes: SimpleChanges) {
    if (this.validateForm) {
      this.validateForm.setValue({ menuName: this.menuName || null });
    }

  }

  submitForm(value: { menuName: string; }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      this.handleOk(value)
      this.validateForm.reset();
    }

  }
  handleMenuFormModalCancel() {
    this.handleCancel();
    this.validateForm.reset();
  }

}
