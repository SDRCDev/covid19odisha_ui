import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Constants } from '@src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class VolunteerRegistrationService {

  termAgree: boolean = false;
  regFormData: any;
  regFormId: string;
  constructor(private httpClient: HttpClient) { }

  getAllOptions() {
    return this.httpClient.get(Constants.HOME_URL + 'options')
  }

  getAreaDetails(areaLevelId, parentAreaId) {
    return this.httpClient.get(Constants.HOME_URL + 'area?areaLevelId='+ areaLevelId +'&parentAreaId=' + parentAreaId)
  }

  saveSubmission(data) {
    return this.httpClient.post(Constants.HOME_URL + 'saveSubmission', data)
  }

  verifyOtp(data) {
    return this.httpClient.post(Constants.HOME_URL + 'validateOTP', data)
  }

  resendOTP(data) {
    return this.httpClient.post(Constants.HOME_URL + 'resendOTP', data)
  }

  /**
  * Upload file and return file path
  * @param file 
  */
 uploadFile(file) {
  const formdata: FormData = new FormData();
  formdata.append('multipartfile', file);

  const req = new HttpRequest('POST', Constants.HOME_URL + 'uploadProfileImage', formdata,{ responseType: 'text' });
  return this.httpClient.request(req);
}

getRegistrationStatus(mobile, lang) {
  return this.httpClient.get(Constants.HOME_URL + 'getRegistrationStatus?mobile=' + mobile +'&languageId=' + lang)
}
}
