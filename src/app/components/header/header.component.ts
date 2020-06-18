import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  public iptShow: boolean = false;

  @Input() isCollapsed: boolean
  @ViewChild('searchIpt') searchIpt: any;
  @ViewChild('rightContent') rightContent: any;

  constructor() { }

  ngOnInit(): void {
  }

  searchIptShow(): void {
    this.iptShow = !this.iptShow;
    const searchIpt = this.searchIpt.nativeElement;
    searchIpt.style.width = this.iptShow ? '200px' : '0px';
  }

  isCollapsedTrigger(): void {
    this.isCollapsed = !this.isCollapsed;
    // const rightContent = this.rightContent.nativeElement;
    // rightContent.style.right = !this.isCollapsed ? '300px' : '100px';
    console.log(this.isCollapsed, 'true 收藏；false 展开, 设置page-header右侧头像等功能项的相对位置')
  }

}
