import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { detachProjectedView } from '@angular/core/src/view/view_attach';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  countLoaded: boolean;

  newsDetails: any[] = [];

  getThematicMapData(formId, selectedOption, typeDetailId): Observable<any>{
    // let apiEndPoint = "dailyIndicatorList-odisha.json";
    
    // return this.httpClient.get("assets/dummy/"+apiEndPoint);
    return this.httpClient.get(Constants.HOME_URL + "bypass/getDashboardData?formId=" +formId+"&optionPath="+selectedOption+ (typeDetailId && formId==2 ? "&typeDetailId="+typeDetailId:''))
  }
  
  getCurrentStatus(areaId) {
    return this.httpClient.get("assets/dummy/quickStartData-odisha.json");
  }

  getAareaWiseData() {
    return this.httpClient.get(Constants.HOME_URL + "getTabularData");
  }
  constructor(private httpClient: HttpClient) {
   }

   getBlockLevelData(formId, selectedOptionPath, districtId) {
     return this.httpClient.get(Constants.HOME_URL + "bypass/getBlockData?formId=" + formId + "&optionPath=" + selectedOptionPath + "&districtId=" + districtId)
   }
   getImortantLinks() {
    return this.httpClient.get(Constants.HOME_URL + 'getAllApprovedImportantLinks');
   }

   getDashboardLeftPanelOptions(areaId) {
     return this.httpClient.get(Constants.HOME_URL + "bypass/getDashboardSelectionPanel" + (areaId ? "?areaId="+areaId: ''))
   }
  
   getRegisterdCounts(){
    return this.httpClient.get(Constants.HOME_URL + 'getIndicatorValue');
   }

   getQuickStarts(){
    return this.httpClient.get(Constants.HOME_URL + "bypass/quickStartData");
  }
}
