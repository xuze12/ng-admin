import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../../services/menu.service'

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss']
})
export class SiderComponent implements OnInit {

  @Input() isCollapsed: boolean
  menus: any = []

  constructor(public menu: MenuService) { }

  ngOnInit(): void {
    this.menus = this.menu.menus
    this.menu.getNewMenus()
    this.menu.urlFindMenuItem()

  }

  handleMenuChange(value:any):void {
    console.log(value,'----menu')
    this.menu.handleMenuChange(value)
  }
  handleOpenChange(value:any){
    console.log(value,'----open')
  }

}
