import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Constants } from '../constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  imageCategory: any;
  galleryImage:any;
  images:any ;
  fileImages:any;

  constructor(private httpClient: HttpClient) { }
  selectedResourceDetails: any; 
 
  getResourceTypeDetails(){
    // return this.httpClient.get(Constants.HOME_URL + 'cms/getCmsTypeDetails?typeId=23');
    // return this.httpClient.get("assets/galleryResource.json");
    return this.httpClient.get(Constants.HOME_URL + 'getResourceTypeDetails');
  }

  /** Save user resources */
  saveResources(details) {
    return this.httpClient.post(Constants.HOME_URL + 'saveGallery', details,{ responseType: 'text' });
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
    return this.httpClient.get(Constants.HOME_URL + 'getAllGallery');
  }
  /**
   * Get the selected resource details
   */
  viewResourceDetails(galleryId){
    return this.httpClient.get(Constants.HOME_URL + 'getGalleryDetails?galleryId='+galleryId);
  }
   /**
   * Delete the selected resources 
   */
  deleteSelectedResourceDetails(galleryId){
    return this.httpClient.get(Constants.HOME_URL + 'deleteGallery?galleryId='+galleryId);
  }
  /**
   * Approve the selected resources 
  */
  approveSelectedResourceDetails(galleryId){
    return this.httpClient.get(Constants.HOME_URL + 'approveGallery?galleryId='+galleryId);
  }
  
  /*photo gallery home page*/
  getSubPhotogalleryData(){
    return this.httpClient.get(Constants.HOME_URL+'getAllApprovedGalleryImage');
  }
}
