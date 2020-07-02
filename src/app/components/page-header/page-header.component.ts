import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() menu: any;

  pageMenu=[]

  constructor() { }

  ngOnInit(): void {
    // this.pageMenu = JSON.parse(window.localStorage.getItem('pageMenu') || '[]')
    // console.log(this.pageMenu,'----this.pageMenu')
  }

}
