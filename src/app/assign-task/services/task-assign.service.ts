import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Constants } from '../../constants';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class TaskAssignService {
  regFormData: any;
  regFormId: string;
  volunteerDetails: any;
  organizationDetails: any;
  volunteerTaskDetails: any;
  taskTableData: any;
  taskTableColumn: any;
  filterOrganizationTableData: any;
  filterVolunteerTableData: any;
  filterTableColumn: any;
  viewMoreClicked: boolean = false;
  orgviewMoreClicked: boolean = false;
  selectedDetails: any;
  volunteerFilterOpened: boolean = false;
  organizationFilterOpened: boolean = false;
  pVal: number = 1;
  filters: any = {};
  allPreferredDistricts: any = [];
  allPreferredBlocks: any = [];
  allPreferredGP: any = [];
  showVlist: boolean = false;
  allPreferredStates: any;

  constructor(private httpClient: HttpClient) { }

  /**
   * Get all volunteers listed based on selection (if any)
  */
  getAllVolunteerList() {
    return this.httpClient.get(Constants.HOME_URL + 'getVolunteers');
  }

  /**
    * Get filtered volunteers listed based on filter
   */
  getFilteredVolunteerList(filterList) {
    return this.httpClient.post(Constants.HOME_URL + 'getFilteredVolunteers', filterList);
  }

  getFilteredOrganizationList(filterList) {
    return this.httpClient.post(Constants.HOME_URL + 'getFilteredOrganizations', filterList);
  }
  /**
   * Get each volunteer details based on click
  */
  getVolunteerDetails(mobNo) {
    return this.httpClient.get(Constants.HOME_URL + 'getVolunteerDetails?mobile=' + mobNo);
  }

  /**
   * Get each volunteer task list based on click
  */
  getVolunteerTaskList(userMobNo) {
    return this.httpClient.get(Constants.HOME_URL + 'getTaskList?mobile=' + userMobNo);
    // return this.httpClient.get(Constants.HOME_URL + 'getTaskList?mobile=8249026800');
  }

  /**
   * add volunteer task on click
  */
  addVolunteerTask(taskDetails) {
    return this.httpClient.post(Constants.HOME_URL + 'addTask', taskDetails, { responseType: 'text' });
  }

  /**
   * View details of each selected volunteer
   * @param selectedDetails 
   */
  viewMore(selectedDetails) {
    this.selectedDetails = selectedDetails;
    this.getVolunteerDetails(selectedDetails.Mobile).subscribe(data => {
      let details: any = data;
      // let valKeys = Object.keys(details);
      // for(let i=0; i<valKeys.length; i++){
      // if(valKeys[i] =='profilePic'){
      // details['address'] ='';
      // details.splice(1, 0, 'address')
      // details.splice(1, 0, {'address': 'adipiscing'})
      //   }
      // }
      this.volunteerDetails = details;
      this.getTaskDetails(selectedDetails);
      if (this.volunteerDetails) {
        this.viewMoreClicked = true;
        this.orgviewMoreClicked = false;
        $("#taskDetails").modal('show');
        $("#organizationDetails").modal('hide');
      }
    })
  }
  orgviewMore(selectedDetails) {
    this.selectedDetails = selectedDetails;
    $("#taskDetails").modal('hide');
    this.getVolunteerDetails(selectedDetails.Mobile).subscribe(data => {
      let details: any = data;
      this.volunteerDetails = details;
      this.getTaskDetails(selectedDetails);
      if (this.volunteerDetails) {
        this.viewMoreClicked = false;
        this.orgviewMoreClicked = true;
        $("#orgTaskDetails").modal('show');
      }
    })
  }
  /**
   * Get task details of volunteer
   * @param selectedDetails
   */
  getTaskDetails(selectedDetails) {
    this.getVolunteerTaskList(selectedDetails.Mobile).subscribe(data => {
      let allData = data;
      this.taskTableColumn = data['tableColumn'];
      this.taskTableData = data['tableData'];
    })
  }

  /**
   * Hide modal on close button click
   */
  destroyModalData() {
    this.viewMoreClicked = false;
    this.orgviewMoreClicked = false;
    $("#taskDetails").modal('hide');
    $("#orgTaskDetails").modal('hide');
  }

  /**
   * Get all volunteer register details
   */
  getAllOptions() {
    return this.httpClient.get(Constants.HOME_URL + 'options')
  }

  /**
   * Get area List based on arealevel selection
   * @param areaLevelId 
   * @param parentAreaId 
   */
  getAreaDetails(areaLevelId, parentAreaId) {
    return this.httpClient.get(Constants.HOME_URL + 'area?areaLevelId=' + areaLevelId + '&parentAreaId=' + parentAreaId)
  }

  /**
   * Get keys of Object
   * @param obj 
   */
  getKeys(obj): any[] {
    return Object.keys(obj);
  }

  /**
   * add volunteer task on click
  */
  addBulkTasks(taskDetails) {
    return this.httpClient.post(Constants.HOME_URL + 'addBulkTask', taskDetails, { responseType: 'text' });
  }

  /**
   * Active/Deactive the selected volunteer
   */
  deactivateVolunteers(voldetails){
    return this.httpClient.post(Constants.HOME_URL + 'deactivateVolunteer', voldetails, { responseType: 'text' });
  }

  /**
   * Generate cerificate for volunteers/organisation
   */
  generateCerificateList(mobNo){
    return this.httpClient.get(Constants.HOME_URL + 'generateCertificate?mobile=' + mobNo, {responseType: "text"})
  }

  /**
   * Download generated certificate
   * @param fileName 
   */
  downloadReport(fileName) {
    return this.httpClient.post(Constants.HOME_URL + 'downloadReport?fileName='+fileName, {}, {responseType:"blob"})
  }

}
