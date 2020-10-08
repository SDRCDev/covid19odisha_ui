import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ReportService } from '../report.service';
import { saveAs} from 'save-as'

@Component({
  selector: 'app-column-list-modal',
  templateUrl: './column-list-modal.component.html',
  styleUrls: ['./column-list-modal.component.scss']
})
export class ColumnListModalComponent implements OnInit {

  columnList: any = [];
  columnListObjectBackup: any;
  selectedColumns: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public reportService: ReportService,private dialogRef:MatDialogRef<ColumnListModalComponent>) { }

  ngOnInit() {
    this.getColumnList(this.data.formId)
  }

  getColumnList(formId) {
    // if(!this.reportService.columnList) {
      this.reportService.getColumnList(formId).subscribe(res => {
        
        this.reportService.columnList = res;
        this.columnListObjectBackup = res;
        this.columnList = res;
        // for (let i = 0; i < Object.keys(this.columnListObjectBackup).length; i++) {
        //   const col = Object.keys(this.columnListObjectBackup)[i];
        //   this.columnList[i] = {}
        //   this.columnList[i]['name'] = col;
        //   this.columnList[i]['value']= true;
        //   this.columnList[i]['child'] = []
        //   if(this.columnListObjectBackup[col].length) {
        //     for (let j = 0; j < this.columnListObjectBackup[col].length; j++) {
        //       const childCol = this.columnListObjectBackup[col][j];
        //       this.columnList[i]['child'][j] = {}
        //       this.columnList[i]['child'][j].name = childCol;
        //       this.columnList[i]['child'][j].value = true;
        //     }
        //   }

        // }
      })
    // } 
    // else {
    //   this.columnListObjectBackup = JSON.parse(JSON.stringify(this.reportService.columnList));
    //   this.columnList = JSON.parse(JSON.stringify(this.reportService.columnList));
    // }
  }

  formatPayLoad() {
    let data = {}
    let selectedColumns = this.columnList.filter(d => d.value);
    for (let i = 0; i < selectedColumns.length; i++) {
      const column = selectedColumns[i];
      if(!column.child.length) {
        data[column.name] = []
      } else {
        let childCols = column.child.filter(d => d.value)
        let arr = [];
        for (let j = 0; j < childCols.length; j++) {
          const childCol = childCols[j];
          arr.push(childCol.name)
        }
        data[column.name] = arr;
      }
    }
    // console.log(data)
    return data;
    
  }

  downloadReport() {
    let payLoad = this.formatPayLoad();
    this.reportService.getRawDataReport(this.data.formId, payLoad).subscribe(res => {
      this.downloadFile(res)
    })
  }

  downloadFile(fileName) {
    this.reportService.downloadReport(fileName).subscribe(data => {
      // console.log(res)
      saveAs(data, fileName)
      this.dialogRef.close();
    })
  }
}
