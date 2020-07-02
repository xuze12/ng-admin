import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  // 接收父级参数
  @Input() isCollapsed: boolean
  @Input() isCollapsedTrigger:any
  @ViewChild('rightContent') rightContent: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logOut(): void {

    localStorage.clear()
    this.router.navigate(['/login'])
  }


}
