import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ImportantLinksService {

  constructor(private httpClient: HttpClient) { }

  /** Save important links */
  saveImportantLinks(details) {
    return this.httpClient.post(Constants.HOME_URL + 'saveImportantLinks', details, { responseType: 'text' });
  }


  getAllImportantLinks() {
    return this.httpClient.get(Constants.HOME_URL + 'getAllImportantLinks');
    // return this.httpClient.get('assets/dummy/important-links.json');
  }

  deleteImportantLinks(id) {
    return this.httpClient.get(Constants.HOME_URL + 'deleteImportantLinks?importantLinksId=' + id);
  }

  approveImportantLinks(id) {
    return this.httpClient.get(Constants.HOME_URL + 'approveImportantLinks?importantLinksId=' + id);
  }
}
