import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { Observable } from 'rxjs';
import { text } from '@angular/core/src/render3';

@Injectable()
export class StaticHomeService {
  selectedLang: string = 'english';
  viewName: String;
  contentDetails: any[] = [];
  contentSection: any = {};
  contentData: any;
  contentList: any[] = [];
  imageCategory: any;
  whatsNewCategory: any;
  viewType: any;
  sectionName: any;
  whatnewdataSection: string;
  menus: any[];
  siteMenus: any[];
  newsDetails: any;
  usefulLinks: any;
  fileName: string;
  whatnewData: any;
  successstoryList: any;
  successCategory: any;
  selectedStoryDetails: any;
  resourceData: any;
  usefulData: any;
  resourceDatadocuments: any;
  suceescontent: any;
  staticUseFullLink = [
    { url: "http://nrhmorissa.gov.in/corona.aspx", title: "National Health Mission, Department of Health & Family Welfare, Government of Odisha" },
    { url: "https://www.mygov.in/covid-19", title: "COVID-19 India Portal, Government of India" },
    { url: "https://www.mohfw.gov.in/ ", title: "Ministry of Health & Family Welfare, Government of India" },
    { url: "https://health.odisha.gov.in/", title: "Department of Health & Family Welfare, Government of Odisha" },
    { url: "https://covid19.odisha.gov.in/", title: "COVID19 Odisha State Portal, Government of Odisha" },
    { url: "https://www.who.int/", title: "World Health Organization Portal" },
  ];
 
  constructor(private httpClient: HttpClient) { }

  getMenuList(menu) {
    // return this.httpClient.get(Constants.HOME_URL+Constants.CMS_URL + 'getPageContent?viewName=Menu&viewType='+menu);
    return this.httpClient.get("assets/menu.json");
  }
  getData(viewName) {
    // return this.httpClient.get(Constants.HOME_URL+Constants.CMS_URL + 'getPageContent?viewName='+viewName + '&viewType=');
    return this.httpClient.get(Constants.HOME_URL + 'getAllApprovedWhatsNew');
  }

  getPhotogalleryData(viewName) {
    return this.httpClient.get(Constants.HOME_URL + Constants.CMS_URL + 'fetchPhotoGallery?viewName=' + viewName);
  }

  // getOrganisationalData() {
  //   return this.httpClient.get(Constants.HOME_URL + Constants.CONTACT_URL +'getOrganisationType');
  // }

  reinitializeData(data) {
    this.contentData = data;
    this.contentDetails = this.contentData.viewContent[this.selectedLang];
    this.contentSection = {};
    // this.homeHindiDetails = this.homeData.viewContent.hindi;
    for (var i = 0; i < this.contentDetails.length; i++) {
      this.contentList = this.contentDetails[i].data;
    }

    if (this.contentData.viewName == 'Home') {
      for (var i = 0; i < this.contentDetails.length; i++) {
        this.contentSection[this.contentDetails[i].key] = this.contentDetails[i];
      }
    }
    // if(this.contentData.viewName == 'Photo Gallery'){
    //   for(var i=0;i<this.contentDetails.length;i++)
    //   {
    //     this.contentSection[this.contentDetails[i].section] = this.contentDetails[i];
    //   }
    // }

    // for(var i=0;i<this.contentDetails.length;i++){
    //   this.contentGallery = this.contentDetails[i].data;
    // }
  }
  /**
  * display the approved stories on home page
 */
  getHomepageStories() {
    return this.httpClient.get(Constants.HOME_URL + 'getAllApprovedSuccessStories');
  }

  getNewsdetails() {
    return this.httpClient.get(Constants.HOME_URL + 'getAllApprovedWhatsNew');
  }
  /*usefullinks*/
  getusefulLinks() {
    return this.httpClient.get(Constants.HOME_URL + 'getAllApprovedImportantLinks');
    // return this.staticUseFullLink;
  }
  download(fileName) {
    return this.httpClient.post(Constants.HOME_URL + 'downloadFile?fileName=' + fileName, '', { responseType: 'blob' });
    // return this.httpClient.get('assets/docs/' + fileName, { responseType: 'blob' });
  
  }
  downloadPDf(id) {
    return this.httpClient.get(Constants.HOME_URL + 'getWhatsNewDetails?whatsNewId=' + id)
  }
  /* success story listing page*/
  getsuccessstoryList() {
    return this.httpClient.get(Constants.HOME_URL + 'getAllApprovedSuccessStories')

  }

  viewStoryDetails(storyId) {
    return this.httpClient.get(Constants.HOME_URL + 'getSuccessStoriesDetails?storyId=' + storyId);
  }

  getResource() {
    return this.httpClient.get(Constants.HOME_URL + 'getAllApprovedResources');
    // return this.httpClient.get(Constants.HOME_URL + 'getAllResources');
    // return this.httpClient.get('assets/dummy/resources-data.json');
    // return this.resourcesData;
  }
  getusefulLink(): any {
    return this.httpClient.get(Constants.HOME_URL + 'getAllApprovedImportantLinks');
    // return this.httpClient.get(Constants.HOME_URL + 'getAllImportantLinks');
    // return this.staticUseFullLink;

  }
}



