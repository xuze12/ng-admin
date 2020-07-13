import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

    const { required, maxLength, minLength, numberAddLetterAddChinese } = MyValidators;

    this.validateForm = this.fb.group({
      name: ['', [required, maxLength(12), minLength(1), numberAddLetterAddChinese]],
      description: ['', [required, maxLength(30), minLength(1), numberAddLetterAddChinese]],
    });
  }

  // 监听父级传值变化
  ngOnChanges(changes: SimpleChanges) {

    const { name = null, description = null } = this.editData || {}
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

    if (this.validateForm.valid) {

      const data = await this.handleOk(value);
      if (data) {
        this.validateForm.reset();
      }
    }
  }

}
