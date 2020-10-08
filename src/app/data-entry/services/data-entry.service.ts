import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Constants } from 'src/app/constants';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {

  constructor(private httpClient: HttpClient) { }

  getDataWithHeaders(url, payload?): Observable<any> {
    payload ? '' : payload = {};
    payload['observe'] = 'response'; /* N.B - To get headers in the response */
    return this.httpClient.request<HttpResponse<Object>>("GET", Constants.API_URL + url, payload)
    .pipe(
      // tap(resp => console.log('response', resp))
    );
  }

  getApiData(url, payload?): Observable<any> {
    payload ? '' : payload = {};
    return this.httpClient.request("GET", Constants.API_URL + url, payload)
    .pipe(
      // tap(resp => console.log('response', resp))
    );
  }

  getRandomInt(max = 99) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getFormattedDate(date: Date): string {
    let separator = "-";
    return date.getDate() + separator + ((date.getMonth() + 1).toString().length < 2 ? "0" : "") + (date.getMonth() + 1) + separator + date.getFullYear();
  }

  getTrakingDataByDate(date): Observable<any> {
    // return this.httpClient.get("assets/dummy/districtData.json");
    let dateFormattedString = this.getFormattedDate(date);
    return this.httpClient.get(Constants.HOME_URL + "getTabularData", { params: { "date": dateFormattedString } })
      .pipe(catchError((e) => {
        throw e;
      }));
  }

  refreshYesterDayData(date): Observable<any> {
    let dateFormattedString = this.getFormattedDate(date);
    return this.httpClient.get(Constants.HOME_URL + "resetTabularData", { params: { "date": dateFormattedString } })
      .pipe(catchError((e) => {
        throw e;
      }));
  }

  saveTrackingData(data, date) {
    let dateFormattedString = this.getFormattedDate(date);
    let payload = {
      params: { "date": dateFormattedString },
    };
    return this.httpClient.post("/covid19odisha/" + "saveTabularData", data, payload)
    .pipe(catchError((e) => {
      if(e.status !==200)
      throw e;
      return of(null);
    }));
    // return this.httpClient.post("assets/dummy/districtData.json", data);
  }

}

export enum MDMViewType {
  Excel = "Excel",
  Web = "Web"
}
