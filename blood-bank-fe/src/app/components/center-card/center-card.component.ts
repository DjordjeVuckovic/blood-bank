import {Component, Input, OnInit} from '@angular/core';
import {Center} from "../../model/Center";
import {Router} from "@angular/router";

@Component({
  selector: 'app-center-card',
  templateUrl: './center-card.component.html',
  styleUrls: ['./center-card.component.css']
})
export class CenterCardComponent implements OnInit {
  @Input() center = new Center();
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  centerProfile(){
    this.router.navigate(['center-profile'], { state: { centerId: this.center.id } })
  }

}