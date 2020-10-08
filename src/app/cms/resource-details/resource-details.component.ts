import { Component, OnInit } from '@angular/core';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
import { Constants } from 'src/app/constants';
import { Location } from '@angular/common';
import { LandingServiceService } from '../resource/landing-service.service';
import { StaticHomeService } from '../static-home.service';
declare var $: any;

@Component({
  selector: 'app-resource-details',
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.scss']
})
export class ResourceDetailsComponent implements OnInit {

  resourceService: LandingServiceService;
  selectedResourceDetails:any;
  data: any;
  iframEnable:boolean = true;
  uploadedFilePaths:any[] = [];
  routerData: any;
  selectedResourceTypeId:any;
  allResourceTypes:any;
  slideIndex: number = 1;
  showOnImageClicked: boolean = false;
  gateway=Constants.HOME_URL+Constants.CMS_URL;
  staticService: StaticHomeService;
  url: any;

// constructor(){}
  constructor(private resourceProvider: LandingServiceService, private staticHomeService: StaticHomeService, private _location: Location, private router: Router, public sanitizer : DomSanitizer) { 
    this.resourceService = resourceProvider;
    this.staticService = staticHomeService;
  }

  ngOnInit() {
    if(!(this.resourceService.selectedResourceDetails)) {
      this.router.navigateByUrl('resources');
    }
      
    this.selectedResourceDetails = this.resourceService.selectedResourceDetails;
      this.selectedResourceDetails.fileName = this.resourceService.selectedResourceDetails.filepathCaptionModel[0].filepath.replace(/^.*[\\\/]/, '');
    if(this.selectedResourceDetails.videoLink){
    let id:any = this.selectedResourceDetails.videoLink.split("/")[this.selectedResourceDetails.videoLink.split("/").length-1];
    let videoLink: string;
       
    if (this.selectedResourceDetails.videoLink.indexOf('youtube') != -1 || this.selectedResourceDetails.videoLink.indexOf('youtu.be') != -1) {
      id = this.selectedResourceDetails.videoLink.split("=")[1]
      videoLink = 'https://www.youtube.com/embed/' + id;
    } else if (this.selectedResourceDetails.videoLink.indexOf('vimeo') != -1) {
      videoLink = "https://player.vimeo.com/video/" + id;
    } else if (this.selectedResourceDetails.videoLink.indexOf('daily') != -1 || this.selectedResourceDetails.videoLink.indexOf('dai.ly') != -1) {
      videoLink = 'https://www.dailymotion.com/embed/video/' + id;
    } else{
      this.iframEnable =false;
      videoLink = this.selectedResourceDetails.videoLink;
    }
    if(this.iframEnable)
     document.getElementById('videoIframe').setAttribute('src', videoLink);
    }
    this.resourceService.viewResourceDetails( this.selectedResourceDetails.id).subscribe(res => {
      this.data = res;        
    })   
    this.showSlides(this.slideIndex);
  } 

  downloadChartToImage(el, id) {
    html2canvas(document.getElementById(id)).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, 'test' + ".jpg");
      });
    });
  }
   openModal() {
    $("#myModal").show();
    // this.showOnImageClicked = true;
    // $("#myModal").modal(show);

  }

  backClicked() {
    this._location.back();
  }

  downloadFiles(fileName) {
    this.staticService.download(fileName).subscribe(res=>{
      saveAs(res, fileName.split('resources/')[1])
    })
  }
  
   closeModal() {
    $("#myModal").hide();
    // this.showOnImageClicked = true;
  }
  
  // let slideIndex = 1;
  
  
   plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }
  
   currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }
  showImage(){
    $("#previewImageModal").modal("show");
  }
  
   showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides")  as HTMLCollectionOf<HTMLElement>;
    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if(slides){
    slides[this.slideIndex-1].style.display = "block";
    }
  }

  openPDF(category){
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(Constants.HOME_URL + 'downloadCmsDoc?fileName= '+category + '&inline='+ true);
    $("#myModal").modal("show");
  }

}
