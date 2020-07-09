import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() menu: any;

  constructor(
    public menuService: MenuService
  ) { }


  ngOnInit(): void {
  }
  // 监听父级传值变化
  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(this.menu,'----------------aaaaaa-')
  //   this.menu = this.menu
  // }

}
