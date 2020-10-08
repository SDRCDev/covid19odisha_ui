import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { Constants } from '@src/app/constants';
import { saveAs } from 'save-as';
import { ColumnListModalComponent } from '../column-list-modal/column-list-modal.component';
import { MatDialog } from '@angular/material';
import { AppService } from '@src/app/app.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: [Constants.fadeAnimation]
})
export class ReportComponent implements OnInit {

  selections: any = {};
  minDate = new Date("12-19-2019");
  todayDate = new Date();
  allOptions: any = {}
  filterOpened: boolean = false;
  reportData: any;
  reportColumnData: any;
  todayDateTime = new Date().getTime();
  excelName: any;
  reportCount: any;
  app: AppService;

  private reportService: ReportService;
  constructor(private reportProvier: ReportService, private dialog: MatDialog, private appservice: AppService) {
    this.reportService = reportProvier;
    this.app = appservice;
  }

  ngOnInit() {
    this.getAllOptions();
    this.getStateReportData();
    this.getReportCount();
  }

  getAllOptions() {
    this.reportService.getAllOptions().subscribe(res => {
      this.allOptions = res;
    })
  }

  getStateReportData() {
    this.reportService.getStateReportData().subscribe(res => {
      let tempReportData = res['tableData'];
      // let odsihaData = {area: (tempReportData[0].parentArea || 'Total'), boldFont: true, district: (tempReportData[0].parentArea || 'Total')}
      // for (let i = 0; i < tempReportData.length; i++) {
      //   let distData = tempReportData[i];
      //   let keys = Object.keys(distData)
      //   keys.forEach(key => {
      //     if(key != "district" && key != "area") {
      //     if(odsihaData[key]) {
      //       odsihaData[key] += distData[key];
      //     } else {
      //       odsihaData[key] = distData[key];
      //     }
      //   }
      //   });
      // }
      // tempReportData.unshift(odsihaData)

      this.reportData = tempReportData;
      this.reportColumnData = res['tableColumn']
    })
  }



  downloadReport(formId) {
    // this.reportService.getRawDataReport(formId).subscribe(res => {
    //   // console.log(res);
    //   this.downloadFile(res);
    // })
    const dialogRef = this.dialog.open(ColumnListModalComponent,
      { width: '600px', disableClose: true, data: { header: 'Choose columns for report', formId: formId, button: 'Ok' } });

  }

  downloadFile(fileName) {
    this.reportService.downloadReport(fileName).subscribe(data => {
      // console.log(res)
      saveAs(data, fileName)
    })
  }

  getReportCount() {
    this.reportService.getReportCount().subscribe(res => {
      this.reportCount = res;
    })
  }

}
