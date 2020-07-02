import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: ['admin', [Validators.required]],
      password: ['changeMyPassword', [Validators.required]],
      remember: [true]
    });
  }

  /**
   * @params username 账号
   * @params password 密码
   * @params grant_type 固定参数 password
   */
  async submitForm() {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const url = '/api/v1/token'
    const params = { grant_type: "password" }


    const { username, password } = this.validateForm.value
    Object.assign(params, { username, password })

    this.http.post(url, params)
      .toPromise()
      .then((data: any) => {
        console.log(data, '---data')
        window.localStorage.setItem('auth_token', data.id_token)
        // window.localStorage.setItem('user_info', JSON.stringify(data.user))
        this.router.navigate(['/'])
      })
      .catch(err => {
        console.log(err, '---err')
        if (err.status === 401) {
        }
      })
  }
}
