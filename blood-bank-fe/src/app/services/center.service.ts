import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Center} from "../model/Center";
import {CenterAdministrator} from "../model/CenterAdministrator";

@Injectable({
  providedIn: 'root'
})
export class CenterService {
  apiHost: string = 'http://localhost:8080/';
  headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }
  getCenter(id: string): Observable<Center> {
    return this.http.get<Center>(this.apiHost + 'api/v1/center/' + id, {headers: this.headers});
  }
  createCenter(center:Center): Observable<Center> {
    return this.http.post<Center>(this.apiHost + 'api/v1/center' , center,{headers: this.headers});
  }
  getAllCenters(): Observable<Center[]> {
    return this.http.get<Center[]>(this.apiHost + 'api/v1/center/', {headers: this.headers});
  }
}
