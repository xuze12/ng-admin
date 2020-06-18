import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  constructor(public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    console.log(this.router)
    this.route.params.subscribe(data => {
      console.log(data, '-----------route params')
    })
  }

}
