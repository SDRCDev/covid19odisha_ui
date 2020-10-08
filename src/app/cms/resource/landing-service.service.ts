import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Constants } from '../../constants';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root' 
})
export class LandingServiceService {

  constructor(private httpClient: HttpClient) { }
  selectedResourceDetails: any; 
  selectedStoryDetails: any
 
  getResourceTypeDetails(){
    return this.httpClient.get(Constants.HOME_URL + 'getResourceTypeDetails');
    // return this.httpClient.get('assets/dummy/getResourceType.json');
  }

  /** Save user resources */
  saveResources(details) {
    return this.httpClient.post(Constants.HOME_URL + 'saveResource', details,{ responseType: 'text' });
  }
 /**
  * Upload file and return file path
  * @param file 
  */
  uploadFile(file) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);

    const req = new HttpRequest('POST', Constants.HOME_URL + 'resourceUploadFile', formdata,{ responseType: 'text' });
    return this.httpClient.request(req);
  }
  /**
   * Get all resources listed based on user
   */
  getAllData(){
    return this.httpClient.get(Constants.HOME_URL + 'getAllResources');
    // return this.httpClient.get('assets/dummy/resources-data.json');
  }
  /**
   * Get the selected resource details
   */
  viewResourceDetails(resourceId){
    return this.httpClient.get(Constants.HOME_URL + 'getResourceDetails?resourceId='+resourceId);
    // return this.httpClient.get("assets/dummy/getResourceDetails.json");
  }
   /**
   * Delete the selected resources 
   */
  deleteSelectedResourceDetails(resourceId){
    return this.httpClient.get(Constants.HOME_URL + 'deleteResource?resourceId='+resourceId);
  }
  /**
   * Approve the selected resources 
  */
  approveSelectedResourceDetails(resourceId){
    return this.httpClient.get(Constants.HOME_URL + 'approveResource?resourceId='+resourceId);
  }   
}
