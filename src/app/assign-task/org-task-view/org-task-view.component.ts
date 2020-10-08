import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, NgForm, FormControl } from '@angular/forms';
import { TaskAssignService } from '../services/task-assign.service';
import { AppService } from '@src/app/app.service';
declare var $: any;

@Component({
  selector: 'app-org-task-view',
  templateUrl: './org-task-view.component.html',
  styleUrls: ['./org-task-view.component.scss']
})
export class OrgTaskViewComponent implements OnInit {

  taskService: TaskAssignService;
  volunteerDetails: any = {};
  taskType: any = [];
  taskDetails: any;
  contactPersonName: string;
  contactPersonMob: any;
  searchFilter: string;
  itemsPerPage: number = 5;
  p: number = 1;
  q; s;
  tempFilterVolunteerTableData: any;
  tempFilterOrganizationTableData; any;
  @Output() tableDataUpdated: EventEmitter<any> = new EventEmitter<any>();

  genders: any;
  serviceTypeOffered: any;
  @Input() allOptionsList: any;
  regForm: any = {};
  mobRegex = /^\d{10}$/g;
  spaceRegex = /^[\S\r\n]/;

  sdrcForm: FormGroup;
  siteKey: string = "6Lc2hdAUAAAAAE6Ssx_3kQj9IiGju0wdsEGd5-Cu"
  profilePic: any
  profileImagePath: any;
  dropdownOptionsMap: any;
  allOptions: any;
  allDistricts: any = [];
  allStates: any = [];
  allCountries: any = [];
  allBlocks: any = [];
  allPS: any = [];
  allPreferredState: any = [];
  allPreferredDistricts: any = [];
  allPreferredBlocks: any = [];
  allPreferredGP: any = [];
  vrService: TaskAssignService;
  volunteerCategories: any;
  fileValidationMessage: string;
  profilePicSelected: boolean;
  checkedProfilePic: boolean = false;
  termAgree: boolean = false;
  app: AppService;

  constructor(private formBuilder: FormBuilder, private vrProvider: TaskAssignService, private dialog: MatDialog, private router: Router, private taskProvider: TaskAssignService, private appserivce: AppService) {
    this.vrService = vrProvider;
    this.taskService = taskProvider;
    this.app = appserivce;
  }

  ngOnInit() {
    this.getAllOptions();
    this.getAllCountries(1, -1);
    this.getAllPreferredStates(2, 1);
  }
  /**
  * Get all data at once
  */
  getAllOptions() {
    this.allOptions = this.allOptionsList;
    this.serviceTypeOffered = this.allOptions['Types of service offered'];
    this.getValues();
  }
  /**
   * Get country level area
   * @param areaLevelId 
   * @param parentAreaId 
   */
  getAllCountries(areaLevelId, parentAreaId) {
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allCountries = res;
      this.regForm.country = this.allCountries[0].areaName;
      this.getAllStates(2, this.taskService.volunteerDetails['country'])
    })
  }
  /**
   *  Get state level area
   * @param areaLevelId 
   * @param parentAreaId 
   */
  getAllStates(areaLevelId, parentAreaId) {
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allStates = res;
      this.regForm.state = this.allStates[0].areaName;
    })
    this.getAllDistricts(3, this.taskService.volunteerDetails['state'])
  }
  /**
   * Get district level area
   * @param areaLevelId 
   * @param parentAreaId 
   */
  getAllDistricts(areaLevelId, parentAreaId) {
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allDistricts = res;
      this.regForm.district = this.allDistricts.filter(d => d.areaId == this.taskService.volunteerDetails['district'])[0].areaName;
    })
  }

  getAllPreferredStates(areaLevelId, parentAreaId) {
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredState = res;
      if (this.taskService.volunteerDetails['areaOfService'] == 105) {
        this.getValues();
      } else {
        this.getAllPreferredDistricts(3, this.taskService.volunteerDetails['preferredState'])
      }
    })
  }
  /**
   * Get all preferred Districts
   * @param areaLevelId 
   * @param parentAreaId 
   */
  getAllPreferredDistricts(areaLevelId, parentAreaId) {
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredDistricts = res;
      if (this.taskService.volunteerDetails['areaOfService'] == 106) {
        this.getValues();
      } else {
        this.getPreferredBlocks(4, this.taskService.volunteerDetails['preferredDistrict'])
      }
    })
  }
  /**
   * Get all preferred Blocks
   * @param areaLevelId 
   * @param parentAreaId 
   */
  getPreferredBlocks(areaLevelId, parentAreaId) {
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredBlocks = res;
      if (this.taskService.volunteerDetails['areaOfService'] == 107) {
        this.getValues();
      }
    })
  }
  /**
   * assign task to volunteer
   * @param form 
   */
  addTask(form: NgForm) {
    let typeOfTask: any = [];
    if (form.valid) {
      // for (let index = 0; index < this.taskType.length; index++) {
      //   typeOfTask.push(this.taskType[index].name)
      // }
      this.volunteerDetails = {
        "name": this.taskService.volunteerDetails['organizationName'],
        "mobile": this.taskService.volunteerDetails['mobile'],
        "task": [this.taskType.name],
        "details": this.taskDetails,
        "contactPerson": this.contactPersonName,
        "contactPersonMobile": this.contactPersonMob
      }
      this.taskService.addVolunteerTask(this.volunteerDetails).subscribe(data => {
        let allData = data;
        // $("#successModal").modal('show');     
        form.resetForm();
        this.taskService.getTaskDetails(this.taskService.selectedDetails);
        this.getVolunteerList();
      })
    }
  }

  getVolunteerList() {
    this.taskService.getAllVolunteerList().subscribe(res => {
      let data = res;
      this.taskService.filterTableColumn = data['tableColumn'];
      this.tempFilterVolunteerTableData = data['tableData'].filter(d => d.formId == 1);
      this.tempFilterOrganizationTableData = data['tableData'].filter(d => d.formId == 2);
      this.taskService.filterVolunteerTableData = data['tableData'].filter(d => d.formId == 1);
      this.taskService.filterOrganizationTableData = data['tableData'].filter(d => d.formId == 2);
      this.taskService.showVlist=false;
      this.taskService.filters = {};
      let emittedData: any = { filterVolunteerTableData: this.tempFilterVolunteerTableData, filterOrganizationTableData: this.tempFilterOrganizationTableData };
    this.tableDataUpdated.emit(emittedData);
    })
  }
  /**
   * Clear search text
   */
  clearSearchText() {
    this.searchFilter = "";
  }
  /**
   * Get volunteer details in table format
   */
  getValues() {
    let qusKey = Object.keys(this.taskService.volunteerDetails);
    if (this.allOptions) {
      for (let i = 0; i < qusKey.length; i++) {
        if (qusKey[i] == 'preferredState' && this.taskService.volunteerDetails["preferredState"] != null) {
          this.regForm.preferredState = this.allPreferredState.filter(d => d.areaId == this.taskService.volunteerDetails['preferredState']);
        }

        if (qusKey[i] == 'preferredDistrict' && this.taskService.volunteerDetails['preferredDistrict'] != null) {
          let distVal: any = [];
          if (this.taskService.volunteerDetails['areaOfService'] == 106) {
            for (let index = 0; index < this.taskService.volunteerDetails['preferredDistrict'].length; index++) {
              distVal.push(this.allPreferredDistricts.filter(d => d.areaId == this.taskService.volunteerDetails['preferredDistrict'][index]))
              this.regForm.preferredDistrict = distVal;
            }
          } else if (this.taskService.volunteerDetails['areaOfService'] != 106) {
            this.regForm.preferredDistrict = this.allPreferredDistricts.filter(d => d.areaId == this.taskService.volunteerDetails['preferredDistrict']);
          }
        }

        if (qusKey[i] == 'preferredBlock' && this.taskService.volunteerDetails['preferredBlock'] != null) {
          if (this.taskService.volunteerDetails['areaOfService'] == 107) {
            let dpVal: any = [];
            for (let index = 0; index < this.taskService.volunteerDetails['preferredBlock'].length; index++) {
              dpVal.push(this.allPreferredBlocks.filter(d => d.areaId == this.taskService.volunteerDetails['preferredBlock'][index]))
              this.regForm.preferredBlock = dpVal;
            }
          } else if (this.taskService.volunteerDetails['areaOfService'] != 107) {
            this.regForm.preferredBlock = this.allPreferredBlocks.filter(d => d.areaId == this.taskService.volunteerDetails['preferredBlock']);
          }
        }

        if (qusKey[i] == 'organizationType' && this.taskService.volunteerDetails["organizationType"] != null) {
          this.regForm.organizationType = this.allOptions['Type of Organization'].filter(d => d.slugId == this.taskService.volunteerDetails['organizationType'])[0].name
        }

        if (qusKey[i] == 'serviceType' && this.taskService.volunteerDetails["serviceType"] != null) {
          this.regForm.serviceType = this.allOptions['Types of service offered'].filter(d => d.slugId == this.taskService.volunteerDetails['serviceType'])[0].name
        }

        if(qusKey[i] == 'preferredCommunicationMethod' &&  this.taskService.volunteerDetails["preferredCommunicationMethod"] !=null){
          this.regForm.preferredCommunicationMethod = this.allOptions['Preferred communication method'].filter(d=>d.slugId == this.taskService.volunteerDetails['preferredCommunicationMethod'])[0].name
        }

        if (qusKey[i] == 'areaOfService' && this.taskService.volunteerDetails["areaOfService"] != null) {
          this.regForm.areaOfService = this.allOptions['Preferred area of service'].filter(d => d.slugId == this.taskService.volunteerDetails['areaOfService'])[0].name
        }
      }
    }
  }

}
