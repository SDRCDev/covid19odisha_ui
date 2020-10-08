import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ImportantLinksService } from '../important-links.service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
declare var $;

@Component({
  selector: 'app-important-links-upload',
  templateUrl: './important-links-upload.component.html',
  styleUrls: ['./important-links-upload.component.scss', '../cms.common.scss']
})
export class ImportantLinksUploadComponent implements OnInit {

  selectionsValue: any = {};
  itemsPerPage: number = 5;
  p: number = 1;
  searchFilter: string;
  tableColumn: any;
  tableData: any;
  selectedLinkId: number;
  editModeOn: boolean = false;
  validationMsg: any;
  app: AppService;
  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  constructor(private _ilService: ImportantLinksService, private router: Router, private appProvider: AppService) { 
    this.app = appProvider;
  }

  ngOnInit() {
    this.getAllImportantLinks();
  }


  publishData(form: NgForm) {
    this._ilService.saveImportantLinks(this.selectionsValue).subscribe(res => {
     
      $('#publishedSuccess').modal('show');
      form.resetForm();
      this.getAllImportantLinks();
    })
  }

  viewMore(details){
    this.router.navigateByUrl("resource-details");
}

  getAllImportantLinks() {
    this._ilService.getAllImportantLinks().subscribe(res => {
      let data:any = res;
      this.tableColumn = data['tableColumn'] || ["sl_No#Sl. No.","title#Title","url#URL","publishedBy#Published By"];
      this.tableData = data['tableData'];
    })
  }

  editImportantLink(linkId, linkDetails) {
    this.selectedLinkId = linkId;
    this.selectionsValue.title = linkDetails.title;
    this.selectionsValue.url = linkDetails.url;
    this.selectionsValue.id = linkDetails.id;
    this.editModeOn = true;
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.editModeOn = false;
    this.p = 1;
    this.selectionsValue = {};
  }

  openModalOnDeleteClick(linkId){
    this.selectedLinkId = linkId;
    $('#deleteResource').modal('show');
   }

  openModalOnApproveClick(linkId){
    $('#approveIL').modal('show');
    this.selectedLinkId = linkId;
  }

  approveImportantLink() {
      this._ilService.approveImportantLinks(this.selectedLinkId).subscribe(res => {
        this.validationMsg=res;
        $('#approveStory').modal('hide');
        $('#error').modal('show');
        this.getAllImportantLinks();
      },err=>{   
        this.validationMsg=err.error.text;
        $('#approveStory').modal('hide');
        $('#approveSuccess').modal('show');
        this.getAllImportantLinks();
      }); 
  }

   deleteSelectedLink(){
      this._ilService.deleteImportantLinks(this.selectedLinkId).subscribe(res => {
        this.validationMsg=res;
        $('#deleteResource').modal('hide');
        $('#deleteSuccess').modal('show');
        this.getAllImportantLinks();
      },err=>{   
        this.validationMsg=err.error.text;
        $('#deleteResource').modal('hide');  
        $('#deleteSuccess').modal('show');
        this.getAllImportantLinks();
      }); 
     }

  clearSearchText() {
    this.searchFilter = "";
  }

 approve(){
  this._ilService.approveImportantLinks(this.selectedLinkId).subscribe(res => {
    this.validationMsg=res;
    $('#approveIL').modal('hide');
    $('#error').modal('show');
    this.getAllImportantLinks();
  },err=>{   
    this.validationMsg=err.error.text;
    $('#approveIL').modal('hide');
    $('#approveSuccess').modal('show');
    this.getAllImportantLinks();
  }); 
 }

}
