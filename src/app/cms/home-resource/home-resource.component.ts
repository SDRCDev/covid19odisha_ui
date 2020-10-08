import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StaticHomeService } from '../static-home.service';
import {saveAs} from 'save-as'
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '@src/app/constants';
import { AppService } from '@src/app/app.service';
declare var $: any;


@Component({
  selector: 'app-home-resource',
  templateUrl: './home-resource.component.html',
  styleUrls: ['./home-resource.component.scss']
})
export class HomeResourceComponent implements OnInit {
  searchTexts: any;
  staticService:StaticHomeService;
  itemsPerPage: number = 5;
  p: number = 1;
  q: number = 1;
  url: any;
  activeTab: number = 1; //to reinitiate pagination page control
  app: AppService

  constructor(private staticServiceProvider: StaticHomeService, private router: Router, private sanitizer: DomSanitizer, private appservice: AppService) {
    this.staticService = staticServiceProvider;
    this.app = appservice;
   }

  ngOnInit() {
    
  this.router.events.subscribe((evt) => {
    if (!(evt instanceof NavigationEnd)) {
      return;
    }
    window.scrollTo(0, 0)
  });

    this.staticService.getResource().subscribe(data=>{
      this.staticService.resourceData =  data['Guidelines and Tools'];
      this.staticService.resourceDatadocuments =  data['Documents'];
  })

}
getName(filePath){
  return filePath.replace(/^.*[\\\/]/, '');
}
redirectTohome() {
  this.router.navigate(['']);
}
// openPDF(category){
//   // let url = 'assets/pdfs/abc.pdf'
//   this.url = this.sanitizer.bypassSecurityTrustResourceUrl(Constants.HOME_URL + 'downloadCmsDoc?fileName= '+category + '&inline='+ true);
// }
downloadFiles(fileName) {
  this.staticService.download(fileName).subscribe(res=>{
    saveAs(res, fileName)
  })
}
openPDF(category){
  this.url = this.sanitizer.bypassSecurityTrustResourceUrl(Constants.HOME_URL + 'downloadCmsDoc?fileName= '+category + '&inline='+ true);
  // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("assets/docs/" + category);
  $("#myModal").modal("show");
  }

  destroyModalData() {
    this.url = "";
    $('#myModal').modal('hide');
  }
}
