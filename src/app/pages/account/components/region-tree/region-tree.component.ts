import { Component, OnInit,Input } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-region-tree',
  templateUrl: './region-tree.component.html',
  styleUrls: ['./region-tree.component.scss']
})
export class RegionTreeComponent implements OnInit {

  @Input() organizeList: any=[];
  
  searchValue = '';

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
