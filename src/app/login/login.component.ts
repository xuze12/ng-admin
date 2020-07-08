import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { MenuService } from '../services/menu.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  roleInfoPower = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    public menuService: MenuService
    ) { }

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

    const is_true = !this.validateForm.valid;
    if (is_true) {
      return;
    }

    const params = { grant_type: "password" }
    Object.assign(params, this.validateForm.value)

    const login_info = await this.login(params);

    if (login_info.id_token) {
      window.localStorage.setItem('auth_token', login_info.id_token);
      let loginUserInfo = {}
      const { grantedAuthorities } = login_info
      const role = grantedAuthorities[0].authority;
      
      if (role === 'ADMIN') {
        loginUserInfo = { roleInfoId: '', role: 'admin', username: login_info.username }
        window.localStorage.setItem('loginUserInfo', JSON.stringify(loginUserInfo))
      } else {

        const roleInfo = await this.buyRoleNameGetRoleId(role);
        console.log(roleInfo, '---roleInfo')
        if (!roleInfo) {
          return
        }

        loginUserInfo = { roleInfoId: roleInfo.id, role: 'role', username: login_info.username }
        window.localStorage.setItem('loginUserInfo', JSON.stringify(loginUserInfo))
      }

      // 获取对应的菜单
      // await this.menuService.getMenuList();

      this.router.navigate(['/']);
    }

  }

  /**
   * 用户登录
   */
  async login(params: any) {

    const url = '/api/v1/token'

    try {
      const token: any = await this.http.post(url, params).toPromise()
      return token.id_token ? token : null
    } catch (error) {
      console.log(error, '---')
      return null;
    }
  }

  /**
   * 获取角色id
   */
  async buyRoleNameGetRoleId(name: string) {
    const url = `/api/api/user/role_info/sign/${name}`
    try {
      const data: any = await this.http.get(url).toPromise();
      return data.code === 200 ? data.data : null;
    } catch (error) {
      console.log(error, '---')
      return null;
    }
  }


}
