import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { Authresponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';

@Injectable()

export class TripDataService {

  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {}

  url = 'http://localhost:3000/api/';
  private tripUrl = `${this.url}trips/`

  getTrips() : Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripUrl);
  }

  // addTrip(formData: Trip) : Observable<Trip> {
  //   return this.http.post<Trip>(this.tripUrl, formData);
  // }
  public addTrip(formData: Trip): Observable<Trip> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization' : `Bearer ${this.storage.getItem('travlr-token')}`
      })
    };

    console.log(formData);
    return this.http.post<Trip>(this.tripUrl, formData, httpOptions);
  }

  getTrip(tripCode: string) : Observable<Trip> {
    // console.log('Inside TripDataService::getTrip()')
    return this.http.get<Trip>(this.tripUrl + '/' + tripCode);
  }

  public updateTrip(formData: Trip) : Observable<Trip> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization' : `Bearer ${this.storage.getItem('travlr-token')}`
      })
    };
    return this.http.put<Trip>(this.tripUrl + '/' + formData.code, formData, httpOptions);
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public login(user: User): Promise<Authresponse> {
    return this.makeAuthApiCall('login', user);
  }

  public register(user: User): Promise<Authresponse> {
    return this.makeAuthApiCall('register', user);
  }

  private makeAuthApiCall(urlPath: string, user: User):
    Promise<Authresponse> {
      const xUrl: string = `${this.url}/${urlPath}`;
      return this.http
        .post(xUrl, user)
        .toPromise()
        .then(response => response as Authresponse)
        .catch(this.handleError);
    }

}
