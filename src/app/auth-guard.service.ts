import { Injectable }     from '@angular/core';
import { CanActivate, Router }    from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private router: Router
  ) {}
  canActivate() {
    const token = window.localStorage.getItem('auth_token')
    if (!token) {
      this.router.navigate(['/login'])
      return false // 不能继续导航
    }

    // 如果验证通过，则放行，继续完成导航
    return true;
  }
}
