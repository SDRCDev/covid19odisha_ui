import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, NgForm, FormControl } from '@angular/forms';
import { TaskAssignService } from '../services/task-assign.service';
import { AppService } from '@src/app/app.service';
declare var $: any;

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
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
  genders:any;
  serviceType: any;
  @Input() allOptionsList: any;
  regForm: any = {};
  mobRegex = /^\d{10}$/g;
  spaceRegex = /^[\S\r\n]/ ;
  tempFilterVolunteerTableData: any;
  tempFilterOrganizationTableData; any;
  @Output() tableDataUpdated: EventEmitter<any> = new EventEmitter<any>();

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
  areaLevels = [
    {
      areaLevelId: 1,
      areaLevelName: "District Level"
    },
    {
      areaLevelId: 2,
      areaLevelName: "Block Level"
    },
    {
      areaLevelId: 3,
      areaLevelName: "Gram Panchayat Level"
    }
  ]
  constructor(private formBuilder: FormBuilder, private vrProvider: TaskAssignService, private dialog: MatDialog, private router: Router, private taskProvider: TaskAssignService, private appservice: AppService) {
    this.vrService = vrProvider;
    this.taskService = taskProvider;
    this.app = appservice;
   }

  ngOnInit() {
    this.getAllOptions();
    this.getAllCountries(1, -1);
    this.getAllPreferredDistricts(3, 2);
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
      this.regForm.areaLevel = this.areaLevels.filter(d => d.areaLevelId == this.taskService.volunteerDetails['areaLevel'])[0].areaLevelName
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
      this.getBlocks(4, this.taskService.volunteerDetails['district']);
      this.getPS(10, this.taskService.volunteerDetails['district'])
    })
  }
  /**
   * Get block level area
   * @param areaLevelId 
   * @param parentAreaId 
   */
  getBlocks(areaLevelId, parentAreaId) {
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allBlocks = res;
      this.regForm.block = this.allBlocks.filter(d => d.areaId == this.taskService.volunteerDetails['block'])[0].areaName;
    })
  }
  /**
   * Get GP level area
   * @param areaLevelId 
   * @param parentAreaId 
   */
  getPS(areaLevelId, parentAreaId) {
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPS = res;
      this.regForm.ps = this.allPS.filter(d => d.areaId == this.taskService.volunteerDetails['ps'])[0].areaName;
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
      if(this.taskService.volunteerDetails['areaLevel'] == 1){
        this.getValues();      
      }else{
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
      if(this.taskService.volunteerDetails['areaLevel'] == 2){
        this.getValues();
      }
      else if(this.taskService.volunteerDetails['areaLevel'] == 3){
        this.getPreferredGP(5, this.taskService.volunteerDetails['preferredBlock'])
      }
    })
  }
  /**
   * Get all preferred GPs
   * @param areaLevelId 
   * @param parentAreaId 
   */
  getPreferredGP(areaLevelId, parentAreaId) {
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredGP = res;
      if(this.taskService.volunteerDetails['areaLevel'] == 3){
        this.getValues();
      }
    })
  }
  /**
   * Get all data at once
   */
  getAllOptions() {
    // this.vrService.getAllOptions().subscribe(res => {
      this.allOptions = this.allOptionsList;
      this.genders = this.allOptions['Gender'];
      this.serviceType = this.allOptions['Service Type'];
    // })
  }
  /**
   * assign task to volunteer
   * @param form 
   */
  addTask(form: NgForm) {
    let typeOfTask: any = [];
    if (form.valid) {
      for (let index = 0; index < this.taskType.length; index++) {
        typeOfTask.push(this.taskType[index].name)
      }
      this.volunteerDetails = {
        "name": this.taskService.volunteerDetails['fullName'],
        "mobile": this.taskService.volunteerDetails['mobile'],
        "task": [typeOfTask],
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
 getValues(){
    let qusKey = Object.keys(this.taskService.volunteerDetails);
    if(this.allOptions){
    for(let i=0; i< qusKey.length; i++){
      if(qusKey[i]=='sex'){
        this.regForm.sex = this.genders.filter(d=>d.slugId == this.taskService.volunteerDetails['sex'])[0].name;
      }

      if(qusKey[i] == 'preferredDistrict' && this.taskService.volunteerDetails['preferredDistrict'] !=null){
        let distVal:any =[];
        if(this.taskService.volunteerDetails['areaLevel'] ==1){
        for (let index = 0; index < this.taskService.volunteerDetails['preferredDistrict'].length; index++) {
          distVal.push(this.allPreferredDistricts.filter(d=>d.areaId == this.taskService.volunteerDetails['preferredDistrict'][index]))
          this.regForm.preferredDistrict =distVal;
        }
       }else if(this.taskService.volunteerDetails['areaLevel'] !=1){
        this.regForm.preferredDistrict = this.allPreferredDistricts.filter(d=>d.areaId == this.taskService.volunteerDetails['preferredDistrict']);
       }
      }

      if(qusKey[i] == 'preferredBlock' && this.taskService.volunteerDetails['preferredBlock'] !=null){
        if(this.taskService.volunteerDetails['areaLevel'] ==2 ){
        let dpVal:any =[];
        for (let index = 0; index < this.taskService.volunteerDetails['preferredBlock'].length; index++) {
         dpVal.push(this.allPreferredBlocks.filter(d=>d.areaId == this.taskService.volunteerDetails['preferredBlock'][index]))
         this.regForm.preferredBlock =dpVal;
        }
       }else if(this.taskService.volunteerDetails['areaLevel'] !=2){
        this.regForm.preferredBlock = this.allPreferredBlocks.filter(d=>d.areaId == this.taskService.volunteerDetails['preferredBlock']);
       }
      }

      if(qusKey[i] == 'preferredGP' && this.taskService.volunteerDetails['preferredGP'] !=null){
        if(this.taskService.volunteerDetails['areaLevel'] ==3 ){
        let gpVal:any =[];
        for (let index = 0; index < this.taskService.volunteerDetails['preferredGP'].length; index++) {
         gpVal.push(this.allPreferredGP.filter(d=>d.areaId == this.taskService.volunteerDetails['preferredGP'][index]))
         this.regForm.preferredGP =gpVal;
        }
       }else if(this.taskService.volunteerDetails['areaLevel'] !=3){
        this.regForm.preferredGP = this.allPreferredBlocks.filter(d=>d.areaId == this.taskService.volunteerDetails['preferredGP']);
       }
      }  

      if(qusKey[i] == 'qualification' && this.taskService.volunteerDetails["qualification"] !=null){
        this.regForm.qualification = this.allOptions['Educational Qualification'].filter(d=>d.slugId == this.taskService.volunteerDetails['qualification'])[0].name
      }

      if(qusKey[i] == 'specification' && this.taskService.volunteerDetails["specification"] != null){
        this.regForm.specification = this.allOptions['Professional'].filter(d=>d.slugId == this.taskService.volunteerDetails['specification'])[0].name
      }

      if(qusKey[i] == 'vocational' &&  this.taskService.volunteerDetails["vocational"] !=null){
        this.regForm.vocational = this.allOptions['Vocational'].filter(d=>d.slugId == this.taskService.volunteerDetails['vocational'])[0].name
      }

      if(qusKey[i] == 'healthCareProfessionals' && this.taskService.volunteerDetails["healthCareProfessionals"] != null){
        this.regForm.healthCareProfessionals = this.allOptions['Health Care Professionals'].filter(d=>d.slugId == this.taskService.volunteerDetails['healthCareProfessionals'])[0].name
      }

      if(qusKey[i]=='trained'){
        this.regForm.trained =this.allOptions['YesNo Type'].filter(d=>d.slugId == this.taskService.volunteerDetails['trained'])[0].name;
      }

      if(qusKey[i] == 'availability' && this.taskService.volunteerDetails["availability"]!=null){
        this.regForm.availability = this.allOptions['Availability'].filter(d=>d.slugId == this.taskService.volunteerDetails['availability'])[0].name
      }

      if(qusKey[i] == 'howVolunteer' && this.taskService.volunteerDetails["howVolunteer"] !=null){
        this.regForm.howVolunteer = this.allOptions['Volunteer Type'].filter(d=>d.slugId == this.taskService.volunteerDetails['howVolunteer'])[0].name
      }

      if(qusKey[i] == 'volunteerTime' && this.taskService.volunteerDetails["volunteerTime"] != null){
        this.regForm.volunteerTime = this.allOptions['Volunteer Time'].filter(d=>d.slugId == this.taskService.volunteerDetails['volunteerTime'])[0].name
      }

      if(qusKey[i] == 'volunteerOrganizations' && this.taskService.volunteerDetails["volunteerOrganizations"] != null){
        let orgVal:any =[];
        for (let index = 0; index < this.taskService.volunteerDetails['volunteerOrganizations'].length; index++) {
         orgVal.push(this.allOptions['Volunteer Organizations'].filter(d=>d.slugId == this.taskService.volunteerDetails['volunteerOrganizations'][index]))
         this.regForm.volunteerOrganizations =orgVal;
        }
      }

      if(qusKey[i] == 'awareness' && this.taskService.volunteerDetails["awareness"] != null){
        let aware:any =[];
        for (let index = 0; index < this.taskService.volunteerDetails['awareness'].length; index++) {
         aware.push(this.allOptions['Public Awareness and Information'].filter(d=>d.slugId == this.taskService.volunteerDetails['awareness'][index]))
         this.regForm.awareness =aware;
        }
      }

      if(qusKey[i] == 'fieldSupport' && this.taskService.volunteerDetails["fieldSupport"] != null){
        let support:any =[];
        for (let index = 0; index < this.taskService.volunteerDetails['fieldSupport'].length; index++) {
         support.push(this.allOptions['On-field support'].filter(d=>d.slugId == this.taskService.volunteerDetails['fieldSupport'][index]))
         this.regForm.fieldSupport =support;
        }
        // this.regForm.fieldSupport = this.allOptions['On-field support'].filter(d=>d.slugId == this.taskService.volunteerDetails['fieldSupport'])
      }

      if(qusKey[i] == 'essentials' && this.taskService.volunteerDetails["essentials"] != null){
        let ess:any =[];
        for (let index = 0; index < this.taskService.volunteerDetails['essentials'].length; index++) {
         ess.push(this.allOptions['Essential services'].filter(d=>d.slugId == this.taskService.volunteerDetails['essentials'][index]))
         this.regForm.essentials =ess;
        }      
      }

      if(qusKey[i] == 'health' && this.taskService.volunteerDetails["health"] != null){
        let hlt:any =[];
        for (let index = 0; index < this.taskService.volunteerDetails['health'].length; index++) {
         hlt.push(this.allOptions['Health'].filter(d=>d.slugId == this.taskService.volunteerDetails['health'][index]))
         this.regForm.health =hlt;
        }    
      }

      if(qusKey[i] == 'reliefCampMgmt' && this.taskService.volunteerDetails["reliefCampMgmt"] != null){
        let relif:any =[];
        for (let index = 0; index < this.taskService.volunteerDetails['reliefCampMgmt'].length; index++) {
          relif.push(this.allOptions['Relief Camp Management'].filter(d=>d.slugId == this.taskService.volunteerDetails['reliefCampMgmt'][index]))
          this.regForm.reliefCampMgmt =relif;
        }          
      }

    }
   }
  }

}

