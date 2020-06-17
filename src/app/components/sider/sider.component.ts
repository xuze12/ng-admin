import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss']
})
export class SiderComponent implements OnInit {

  @Input() isCollapsed:boolean

  constructor() { }

  ngOnInit(): void {
  }

}
