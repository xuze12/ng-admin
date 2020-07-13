import { Component, OnInit, Input } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-region-tree',
  templateUrl: './region-tree.component.html',
  styleUrls: ['./region-tree.component.scss']
})

export class RegionTreeComponent implements OnInit {

  @Input() organizeList: any = [];
  searchValue = '';

  constructor() { }

  ngOnInit(): void {
  }

  handelSearch(event: NzFormatEmitEvent) {

    console.log(event);
  }


}
