import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormControl } from '@angular/forms';
import { TaskAssignService } from '../services/task-assign.service';
import { SearchTextPipe } from '@src/app/assign-task/filters/search-text.pipe';
import { SearchDisableTextPipe } from '@src/app/assign-task/filters/search-disable-text.pipe';
import { saveAs} from 'save-as'
import { AppService } from '../../app.service';

declare var $: any;

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tableData: any
  tableColumn: any;
  searchFilter: string;
  itemsPerPage: number = 8;
  p: number = 1;
  taskService: TaskAssignService;
  allOptions: any = {};
  pVal: number = 1;
  qVal: number = 1;
  tempFilterVolunteerTableData: any;
  tempFilterOrganizationTableData: any;

  volunteerDetails: any = [];
  taskType: any = [];
  taskDetails: any;
  contactPersonName: string;
  contactPersonMob: any;
  serviceTypeOffered: any;
  serviceType: any;
  mobRegex = /^\d{10}$/g;
  spaceRegex = /^[\S\r\n]/;
  assignTaskLink: boolean = false;
  selectedUserModelList: any = [];
  errorMessage: any;
  tabIndex: number = 0;
  volunteerMobile: any;
  rejectReason: any;
  selectAllVList?: boolean = false;
  selectAllOList?: boolean = false;
  checkData?: boolean = false;
  vData: any = [];
  oData: any = [];
  orgtotalData: any;
  totalData: any;
  designations: any;
  app: AppService

  constructor(private taskProvider: TaskAssignService, private appService: AppService) {
    this.taskService = taskProvider;
    this.app = appService;
  }

  ngOnInit() {
    this.getVolunteerList();
    this.getAllOptions();
    if (localStorage.getItem('user_details')) {
      var token = JSON.parse(localStorage.getItem('user_details'));
      this.designations = token.designationNames[0];
    }
  }

  getAllOptions() {
    this.taskService.getAllOptions().subscribe(res => {
      this.allOptions = res;
      this.serviceTypeOffered = this.allOptions['Types of service offered'];
      this.serviceType = this.allOptions['Service Type'];
    })
  }

  getVolunteerList() {
    this.taskService.getAllVolunteerList().subscribe(res => {
      let data = res;
      this.taskService.filterTableColumn = data['tableColumn'];
      this.tempFilterVolunteerTableData = data['tableData'].filter(d => d.formId == 1);
      this.tempFilterOrganizationTableData = data['tableData'].filter(d => d.formId == 2);
      this.taskService.filterVolunteerTableData = data['tableData'].filter(d => d.formId == 1);
      this.taskService.filterOrganizationTableData = data['tableData'].filter(d => d.formId == 2);
      this.taskService.showVlist = false;
      this.taskService.filters = {};
    })
  }

  updateTableData(event) {
    this.tempFilterVolunteerTableData = event.filterVolunteerTableData;
    this.tempFilterOrganizationTableData = event.filterOrganizationTableData;
  }

  clearSearchText() {
    this.searchFilter = "";
  }

  tabSwitched(e) {
    this.tabIndex = e.index;
    this.searchFilter = undefined;
    this.taskService.filters = {};
    this.taskService.showVlist = false;
    this.assignTaskLink = false;
    this.taskService.filterVolunteerTableData = JSON.parse(JSON.stringify(this.tempFilterVolunteerTableData))
    this.taskService.filterOrganizationTableData = JSON.parse(JSON.stringify(this.tempFilterOrganizationTableData))
    this.selectAllVList = false;
    this.selectAllOList = false;
    this.vData = [];
    this.oData = [];
    this.taskDetails = "";
    this.contactPersonMob = "";
    this.contactPersonName = "";
    if (e.index == 0) {
      this.serviceType = this.allOptions['Service Type'];
      // if (this.vData.length == this.taskService.filterVolunteerTableData.length)
      //   this.selectAllVList = true
      // else
      //   this.selectAllVList = false;
      for (var i = 0; i < this.taskService.filterVolunteerTableData.length; i++) {
        this.taskService.filterVolunteerTableData[i].checked = false;
      }
    } else {
      this.serviceTypeOffered = this.allOptions['Types of service offered'];
      // if (this.oData.length == this.taskService.filterOrganizationTableData.length)
      //   this.selectAllOList = true
      // else
      //   this.selectAllOList = false;
      for (var i = 0; i < this.taskService.filterOrganizationTableData.length; i++) {
        this.taskService.filterOrganizationTableData[i].checked = false;
      }
    }
  }

  backClicked() {
    this.getVolunteerList();
    this.assignTaskLink = false;
    this.selectAllOList = false;
    this.selectAllVList = false
  }

  selectUserForaddTask(ischeck, details) {
    this.assignTaskLink = false;
    let ischecked = ischeck

    if (this.tabIndex == 0) {
      if (this.totalData) {
        this.vData = (this.totalData);
      }
      if (ischecked && !details.deactivated) {
        // details.checked =ischecked;
        this.vData.push(details);
        let allActiveDAta:any=[];
        for (var i = 0; i < this.taskService.filterVolunteerTableData.length; i++) {
          if (!this.taskService.filterVolunteerTableData[i].deactivated) {
          allActiveDAta.push(this.taskService.filterVolunteerTableData[i]);
          }
        }
        if (this.vData.length == allActiveDAta.length)
          this.selectAllVList = true;
        else
          this.selectAllVList = false;
      }
      else if (!ischecked) {
        this.selectAllVList = false;
        this.vData.pop();
      }
    } else if (this.tabIndex == 1) {
      if (this.orgtotalData) {
        this.oData = (this.orgtotalData);
      }
      if (ischecked) {
        // details.checked =ischecked;
        this.oData.push(details);
        if (this.oData.length == this.taskService.filterOrganizationTableData.length)
          this.selectAllOList = true;
        else
          this.selectAllOList = false;
      }
      else if (!ischecked) {
        this.selectAllOList = false;
        this.oData.pop();
      }
    }
  }
  /**
  * Group all the selected volunteers/organizations
  */
  grpAssignTask() {
    this.selectedUserModelList = [];
    if (this.tabIndex == 0) {
      for (var i = 0; i < this.taskService.filterVolunteerTableData.length; i++) {
        if (this.taskService.filterVolunteerTableData[i].checked) {
          this.selectedUserModelList.push(this.taskService.filterVolunteerTableData[i]);
          this.assignTaskLink = true;
        }
      }
    } else if (this.tabIndex == 1) {
      for (var i = 0; i < this.taskService.filterOrganizationTableData.length; i++) {
        if (this.taskService.filterOrganizationTableData[i].checked) {
          this.selectedUserModelList.push(this.taskService.filterOrganizationTableData[i]);
          this.assignTaskLink = true;
        }
      }
    }

    if (this.selectedUserModelList.length > 0) {
      $(".assignTaskLink").click(function () {
        $('html,body').animate({
          scrollTop: $(".taskform").offset().top
        },
          'slow');
      });
    }
    if (this.selectedUserModelList.length == 0) {
      this.errorMessage = "Please select atleast one volunteer/organization from list"
      $("#errorModal").modal('show');
    }
  }
  /**
  * assign multiple tasks to volunteers/organizations
  * @param form 
  */
  addTaskToMultipleOrganistion(form: NgForm) {
    let typeOfTask: any = [];
    if (form.valid) {
      if (this.tabIndex == 0) {
        for (let index = 0; index < this.taskType.length; index++) {
          typeOfTask.push(this.taskType[index].name)
        }
        for (let index = 0; index < this.selectedUserModelList.length; index++) {
          this.volunteerDetails.push({
            "name": this.selectedUserModelList[index]['Name'],
            "mobile": this.selectedUserModelList[index]['Mobile'],
            "task": [typeOfTask],
            "details": this.taskDetails,
            "contactPerson": this.contactPersonName,
            "contactPersonMobile": this.contactPersonMob
          })
        }
      } else if (this.tabIndex == 1) {
        for (let index = 0; index < this.selectedUserModelList.length; index++) {
          this.volunteerDetails.push({
            "name": this.selectedUserModelList[index]['Name'],
            "mobile": this.selectedUserModelList[index]['Mobile'],
            "task": [this.taskType.name],
            "details": this.taskDetails,
            "contactPerson": this.contactPersonName,
            "contactPersonMobile": this.contactPersonMob
          })
        }
      }
      if (this.volunteerDetails.length > 0) {
        this.taskService.addBulkTasks(this.volunteerDetails).subscribe(data => {
          let allData = data;
          form.resetForm();
          this.getVolunteerList();
          this.pVal = 1;
          this.qVal = 1;
          $("#successModal").modal('show');
          this.selectedUserModelList = [];
          this.volunteerDetails = [];
          this.selectAllVList = false;
          this.selectAllOList = false;
        })
      }
    }
  }

  closeModal() {
    $("#successModal").modal('hide');
    this.assignTaskLink = false;
    this.vData = [];
    this.oData = [];
  }

  activateUser(mobileNo) {
    if (mobileNo) {
      let volDetail: any = {
        "mobile": mobileNo,
        "deactivated": false,
        "remark": ""
      }
      this.taskService.deactivateVolunteers(volDetail).subscribe(data => {
        let allVolData = data;
        this.getVolunteerList();
        this.pVal = 1;
        this.qVal = 1;
        this.assignTaskLink = false;
      })
    }
  }

  deactivateUser(mobileNo) {
    $("#rejectionInfoMessage").modal('show');
    this.assignTaskLink = false;
    this.volunteerMobile = mobileNo;
  }

  deactiveDetails(f: NgForm) {
    if (this.volunteerMobile) {
      let volDetail: any = {
        "mobile": this.volunteerMobile,
        "deactivated": true,
        "remark": this.rejectReason
      }
      this.taskService.deactivateVolunteers(volDetail).subscribe(data => {
        let allVolData = data;
        f.resetForm();
        this.getVolunteerList();
        this.pVal = 1;
        this.qVal = 1;
        $("#rejectionInfoMessage").modal('hide');
      }, err => {
        $("#rejectionInfoMessage").modal('hide');
      })
    }
  }

  reasonText(model) {
    this.rejectReason = model;
  }

  selectAllVolunteers() {
    this.selectAllVList = !this.selectAllVList;
    this.selectAllOList = !this.selectAllOList;

    if (this.tabIndex == 0) {
      this.vData = [];
      if (this.selectAllVList) {
        if (this.searchFilter == undefined || this.searchFilter == "") {
          for (var i = 0; i < this.taskService.filterVolunteerTableData.length; i++) {
            if (!this.taskService.filterVolunteerTableData[i].deactivated) {
              this.taskService.filterVolunteerTableData[i].checked = true;
              this.vData.push(this.taskService.filterVolunteerTableData[i]);
              this.selectAllVList = false;
            }
          }
          this.assignTaskLink = false;
        } else {
          this.totalData = new SearchDisableTextPipe().transform(this.taskService.filterVolunteerTableData, this.searchFilter);
          console.log(this.totalData);
          for (var i = 0; i < this.totalData.length; i++) {
            if (!this.totalData[i].deactivated) {
              this.totalData[i].checked = true;
              this.selectAllVList = false;
            }
          }
          this.assignTaskLink = false;
        }
      }
      else {
        for (var i = 0; i < this.taskService.filterVolunteerTableData.length; i++) {
          this.taskService.filterVolunteerTableData[i].checked = false;
          this.selectAllVList = true;
        }
        this.assignTaskLink = false;
      }
    }
    if (this.tabIndex == 1) {
      this.oData = [];
      if (this.selectAllOList) {
        if (this.searchFilter == undefined || this.searchFilter == "") {
          for (var i = 0; i < this.taskService.filterOrganizationTableData.length; i++) {
            this.taskService.filterOrganizationTableData[i].checked = true;
            this.oData.push(this.taskService.filterOrganizationTableData[i]);
            this.selectAllOList = false;
          }
          this.assignTaskLink = false;
        } else {
          this.orgtotalData = new SearchTextPipe().transform(this.taskService.filterOrganizationTableData, this.searchFilter);
          for (var i = 0; i < this.orgtotalData.length; i++) {
            this.orgtotalData[i].checked = true;
            this.selectAllOList = false;
          }
          this.assignTaskLink = false;
        }
      }
      else {
        for (var i = 0; i < this.taskService.filterOrganizationTableData.length; i++) {
          this.taskService.filterOrganizationTableData[i].checked = false;
          this.selectAllOList = true
        }
        this.assignTaskLink = false;
      }
    }
  }

  generateCertificate(mobileDetail){
    this.taskService.generateCerificateList(mobileDetail).subscribe(data => {
      this.downloadFile(data);
    })
  }

  downloadFile(fileName) {
    this.taskService.downloadReport(fileName).subscribe(res => {
      saveAs(res, fileName)
    })
  }
}
