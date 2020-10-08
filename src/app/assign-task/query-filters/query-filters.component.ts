import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../report/report.service';
import { saveAs} from 'save-as';
import { TaskAssignService } from '@src/app/assign-task/services/task-assign.service';

@Component({
  selector: 'app-query-filters',
  templateUrl: './query-filters.component.html',
  styleUrls: ['./query-filters.component.scss']
})
export class QueryFiltersComponent implements OnInit {

  // filters: any = {};
  minDate = new Date("12-19-2019");
  todayDate = new Date()
  selectedServiceCategories: any;
  selectedLeftTab: string = 'gender';
  isTaskAssignedOptions = [
    {
      label: "Yes",
      value: true
    },
    {
      label: "No",
      value: false
    }
  ]
  @Input() allOptions: any;
  // allPreferredDistricts: any = [];
  // allPreferredBlocks: any = [];
  // allPreferredGP: any = [];
  reportService: ReportService;
  taskService: TaskAssignService;
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
  serviceTypes = [
    {
      id: 1,
      name: "Public awareness and Information"
    },
    {
      id: 2,
      name: "On-field support"
    },
    {
      id: 3,
      name: "Essential services"
    }, {
      id: 4,
      name: "Health"
    },
    {
      id: 5,
      name: "Relief Camp Management"
    }
  ]
  constructor(private reportProvider: ReportService, private taskProvider: TaskAssignService) {
    this.reportService = reportProvider;
    this.taskService = taskProvider;
  }

  ngOnInit() {
    // console.log(this.allOptions);
    this.getAllPreferredDistricts(3, 2);
  }

  selectLeftTab(tab) {
    this.selectedLeftTab = tab;
  }
  areaChange(){
    if(this.taskService.filters.areaLevel==1){
    this.taskService.filters.districts=undefined;
    this.taskService.filters.blocks=undefined;
    this.taskService.filters.gps=undefined;
    }
    if(this.taskService.filters.areaLevel==2){
      this.taskService.filters.blocks=undefined;
      this.taskService.filters.gps=undefined;
    }
    if(this.taskService.filters.areaLevel==3){
      this.taskService.filters.gps=undefined;
    }
  }
  getAllPreferredDistricts(areaLevelId, parentAreaId) {
    //  this.taskService.filters.districts = undefined;
    // if(this.taskService.filters.areaLevel ==1){
    //   this.taskService.filters.blocks = undefined;
    //   this.taskService.filters.gps = undefined;
    // }
    this.reportService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.taskService.allPreferredDistricts = res;
    })
  }
  getPreferredBlocks(areaLevelId, parentAreaId) {
    // this.allPreferredGP = []
    //  this.taskService.filters.blocks = undefined;
    //  this.taskService.filters.gps = undefined;
    this.reportService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.taskService.allPreferredBlocks = res;
    })
  }

  getPreferredGP(areaLevelId, parentAreaId) {
    //  this.taskService.filters.gps = undefined;
    this.reportService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.taskService.allPreferredGP = res;
    })
  }

  resetAll() {
     this.taskService.filters = {};
  }

  ApplyFilter() {

    // if ( this.taskService.filters.areaLevel == 2) {
    //    this.taskService.filters.districts = [ this.taskService.filters.districts]
    // } else if ( this.taskService.filters.areaLevel == 3) {
    //    this.taskService.filters.districts = [ this.taskService.filters.districts]
    //    this.taskService.filters.blocks = [ this.taskService.filters.blocks]
    // }
    let districts, blocks;
    if (this.taskService.filters.areaLevel == 2) {
      if(this.taskService.filters.districts) districts = [this.taskService.filters.districts];
      blocks = this.taskService.filters.blocks
    } else if (this.taskService.filters.areaLevel == 3) {
      if(this.taskService.filters.districts) districts = [this.taskService.filters.districts]
      if(this.taskService.filters.blocks) blocks = [this.taskService.filters.blocks]
    } else {
      districts = this.taskService.filters.districts;
      blocks = this.taskService.filters.blocks
    }
    let data = {
      areaLevel:  this.taskService.filters.areaLevel ?  this.taskService.filters.areaLevel : null,
      // districts:  this.taskService.filters.districts ?  this.taskService.filters.districts : [],
      // blocks:  this.taskService.filters.blocks ?  this.taskService.filters.blocks : [],
      districts: districts ? districts : [],
      blocks: blocks ? blocks : [],
      gps:  this.taskService.filters.gps ?  this.taskService.filters.gps : [],
      genders:  this.taskService.filters.genders ?  this.taskService.filters.genders : [],
      qualifications:  this.taskService.filters.qualifications ?  this.taskService.filters.qualifications : [],
      professions:  this.taskService.filters.professions ?  this.taskService.filters.professions :[],
      vocationals:  this.taskService.filters.vocationals ?  this.taskService.filters.vocationals : [],
      workFrom: [],
      workTime: [],
      awareness:  this.taskService.filters.awareness ?  this.taskService.filters.awareness : [],
      fieldSupport:  this.taskService.filters.fieldSupport ?  this.taskService.filters.fieldSupport : [],
      essentials:  this.taskService.filters.essentials ?  this.taskService.filters.essentials : [],
      health:  this.taskService.filters.health ?  this.taskService.filters.health : [],
      reliefCampMgmt:  this.taskService.filters.reliefCampMgmt ?  this.taskService.filters.reliefCampMgmt : [],
      availability: this.taskService.filters.availability ? this.taskService.filters.availability: [],
      fromDate: this.taskService.filters.fromDate ? this.taskService.filters.fromDate.getFullYear()+'-'+(this.taskService.filters.fromDate.getMonth()+1)+'-'+this.taskService.filters.fromDate.getDate(): null,
      toDate: this.taskService.filters.toDate ? this.taskService.filters.toDate.getFullYear()+'-'+(this.taskService.filters.toDate.getMonth()+1)+'-'+this.taskService.filters.toDate.getDate(): null,
      isAssignedTask: this.taskService.filters.isTaskAssigned != undefined ? this.taskService.filters.isTaskAssigned: null
    }
    
    this.taskService.getFilteredVolunteerList(data).subscribe(res => {
      let val =res;
      this.taskService.filterTableColumn = val['tableColumn'];
      this.taskService.filterVolunteerTableData = val['tableData'];
      this.taskService.volunteerFilterOpened=false;
      this.taskService.organizationFilterOpened=false;
      this.taskService.pVal = 1;
      this.taskService.showVlist=true;
    })
  }

  getObjectByKey(key, keyValue, arr) {
    return arr.filter(a => a[key] == keyValue)[0]
  }

}
