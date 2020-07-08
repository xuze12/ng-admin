import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../../services/menu.service'

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss']
})
export class SiderComponent implements OnInit {

  @Input() isCollapsed: boolean;
  menus: any = [];

  constructor(public menu: MenuService) { }

  async ngOnInit() {
    await this.menu.getMenuList();
    this.menus = this.menu.menus;
  }

 async handleMenuChange(value: any) {
    // console.log(value,'----menu')
   await this.menu.handleMenuChange(value)
  }
  handleOpenChange(value: any) {
    // console.log(value,'----open')
  }

}
