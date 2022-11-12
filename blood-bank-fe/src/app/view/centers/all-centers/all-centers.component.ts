import { Component, OnInit } from '@angular/core';
import {CenterService} from "../../../services/center.service";
import {Center} from "../../../model/Center";
import {GoogleMapApiService} from "../../../services/googleMapApi.service";

@Component({
  selector: 'app-all-centers',
  templateUrl: './all-centers.component.html',
  styleUrls: ['./all-centers.component.css']
})
export class AllCentersComponent implements OnInit {
  centers : Center[]= []
  centersFiltered : Center[]= []
  centersFilterdByCountry : Center[]= []
  private map!: google.maps.Map;
  constructor(private centerService:CenterService,private mapLoader:GoogleMapApiService) { }

  ngOnInit(): void {
    const loaded = this.mapLoader.googleApi.then(()=>{
      this.map =  new google.maps.Map(
        document.getElementById("map") as HTMLElement,{
          center: {lat: 44.0165,lng: 21.0059},
          zoom: 6
        }
      )
    }).catch(e => {
      console.log("Something goes wrong",e)
    });
    loaded.then(()=>{
      this.getAllCenters()
      }
    )
    loaded.then()

  }

  public getByCountryFilter(name: string){
    if(name ==="All"){
      this.centersFiltered = this.centers
      this.centersFilterdByCountry = this.centers
      this.filterMap();
    }
    else{
      this.centersFilterdByCountry = this.centers.filter((obj) => {
        return obj.country === name;
      });
      this.centersFiltered = this.centersFilterdByCountry
      this.filterMap();
    }
  }

  private getAllCenters(){
    this.centerService.getAllCenters().subscribe(
      (response)=>{
        this.centers = response;
        this.centersFiltered = response;
        this.centersFilterdByCountry = response;
        console.log(this.centers)
        this.centersFiltered.forEach((center)=>{
          new google.maps.Marker({
            position: {
              lat: center.latitude,
              lng: center.longitude
            },
            map: this.map,
            title: center.name
          });
        })
      },
    )
  }

  private filterMap(){
    this.centersFiltered.forEach((center)=> {
      new google.maps.Marker({
        position: {
          lat: center.latitude,
          lng: center.longitude
        },
        map: this.map,
        title: center.name
      });
    })
  }

  getByCityFilter(city: string) {
    if(city ==="All"){
      this.centersFiltered = this.centersFilterdByCountry

      this.filterMap();
    }
    else{
      this.centersFiltered = this.centersFilterdByCountry.filter((obj) => {
        return obj.city === city;
      });
      this.filterMap();
    }
  }
  sortCenters(sort: string){
    console.log(sort)
    if(sort === "nameAsc"){
      this.centersFiltered.sort((a, b) => (a.name?.toLowerCase()! > b.name?.toLowerCase()! ? 1 : -1));
    }else if(sort === "nameDesc"){
      this.centersFiltered.sort((a, b) => (a.name?.toLowerCase()! > b.name?.toLowerCase()! ? -1 : 1));
    }else if(sort === "cityAsc"){
      this.centersFiltered.sort((a, b) => (a.city?.toLowerCase()! > b.city?.toLowerCase()! ? 1 : -1));
    }else if(sort === "cityDesc"){
      this.centersFiltered.sort((a, b) => (a.city?.toLowerCase()! > b.city?.toLowerCase()! ? -1 : 1));
    }else if(sort === "gradeAsc"){
      this.centersFiltered.sort((a, b) => (a > b ? 1 : -1));
    }else if(sort === "gradeDesc"){
      this.centersFiltered.sort((a, b) => (a > b ? -1 : 1));
    }

  }
}
