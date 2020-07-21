import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MenuService } from '../../services/menu.service'

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss']
})

export class SiderComponent implements OnInit {

  @Input() isCollapsed: boolean;
  menus: any = [];

  constructor(public menuService: MenuService) { }

  async ngOnInit() {
    await this.menuService.getMenuList();
    this.menus = this.menuService.menus;
  }

  // 监听父级传值变化
  ngOnChanges(changes: SimpleChanges) {
    //  console.log(121212121211212121212)
    this.menus = this.menuService.menus;
  }

  async handleMenuChange(value: any) {
    // console.log(value,'----menu')
    await this.menuService.handleMenuChange(value)
  }
  handleOpenChange(value: any) {
    // console.log(value,'----open')
  }

}
