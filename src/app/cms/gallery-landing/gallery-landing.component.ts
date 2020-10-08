import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF } from "ngx-image-gallery";
import { DEMO_GALLERY_CONF_INLINE } from "./const";
import { GalleryService } from '../gallery.service';
import { Constants } from 'src/app/constants';
import { AppService } from '@src/app/app.service';

declare var $: any;


@Component({
  selector: 'app-gallery-landing',
  templateUrl: './gallery-landing.component.html',
  styleUrls: ['./gallery-landing.component.scss']
})
export class GalleryLandingComponent implements OnInit {

  subgalleryData: any;
  subgalleryDetails: any[] = [];
  subgallerySection: any = {};
  subphotoCategory: any[] = [];
  isImageGalleryOpen: Boolean = false;
  gateway = Constants.HOME_URL;
  vimeoUrl = 'https://vimeo.com/197933516';
  // slideIndex: number = 1;
  //  showSlides(slideIndex) : void {}
  iframEnable:boolean=true;
  public showConf: boolean = true;
  videos: any[];
  // get reference to gallery component
  @ViewChild('ngxImageGallery') ngxImageGallery: NgxImageGalleryComponent;

  // gallery configuration
  conf: GALLERY_CONF = DEMO_GALLERY_CONF_INLINE;

  // gallery images
  //  images: GALLERY_IMAGE[] = DEMO_GALLERY_IMAGE;
  images: any[] = [];
  @Input() filterBy?: string = 'all'

  visibleImages: any[];
  fileImages: any;
  imageLength: number;
  p: number = 1;
  searchTexts: any;
  staticService: GalleryService;
  app: AppService
  constructor(private router: Router, private staticServiceProvider: GalleryService, private appservice: AppService) {

    // this.visibleImages = this.imageService.getImages();
    this.staticService = staticServiceProvider;
    this.app = appservice;
  }

  ngOnInit() {

    // if(!this.staticService.imageCategory){
    //   this.router.navigate(['pages/photo-gallery']);
    //   }

    this.staticService.getSubPhotogalleryData().subscribe(data => {
      this.images = <any[]>data['Image Gallery'];
      this.imageLength = this.images.length;
      this.images.forEach((value) => {
        this.fileImages = value.url;
      });
      this.videos = <any[]>data['Video Gallery'];
    })


  }


  redirectToGallrey() {
    this.router.navigate(['pages/photo-gallery']);
  }

  // METHODS
  // open gallery
  openGallery(index) {
    // this.isImageGalleryOpen = true;
    this.ngxImageGallery.open(index);
  }

  // close gallery
  closeGallery() {
    this.ngxImageGallery.close();
  }

  // set new active(visible) image in gallery
  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }

  // next image in gallery
  nextImage() {
    this.ngxImageGallery.next();
  }

  // prev image in gallery
  prevImage() {
    this.ngxImageGallery.prev();
  }

  /**************************************************/

  // EVENTS
  // callback on gallery opened
  galleryOpened(index) {
    console.info('Gallery opened at index ', index);
  }

  // callback on gallery closed
  galleryClosed() {
    this.isImageGalleryOpen = false;
    console.info('Gallery closed.');
  }

  // callback on gallery image clicked
  galleryImageClicked(index) {
    console.info('Gallery image clicked with index ', index);
  }

  // callback on gallery image changed
  galleryImageChanged(index) {
    console.info('Gallery image changed to index ', index);
  }

  openModal(index: number) {


    this.isImageGalleryOpen = true;
    // this.ngxImageGallery.loading=false;
    this.ngxImageGallery.opened = true;
    this.ngxImageGallery.activeImageIndex = index;
    this.ngxImageGallery.setActiveImage(index);
    document.getElementById("ngxalbum").style.display = "block";

  }

  openVideoModal(link) {
    $("#videoModal").modal('show');
    this.setVideosInIframe(link);
  }
  hideVideoModal() {
    document.getElementById('videoIframe').setAttribute('src', '');
  }

  getIdFromVideoLink(link) {
    if (link.indexOf('youtube') != -1 || link.indexOf('youtu.be') != -1) {
      return link.split("=")[1]
    }
  }
  setVideosInIframe(link){

    if(link){
      let id:any = link.split("/")[link.split("/").length-1];
      let videoLink: string;
         
      if (link.indexOf('youtube') != -1 || link.indexOf('youtu.be') != -1) {
        id = link.split("=")[1]
        videoLink = 'https://www.youtube.com/embed/' + id;
      } else if (link.indexOf('vimeo') != -1) {
        videoLink = "https://player.vimeo.com/video/" + id;
      } else if (link.indexOf('daily') != -1 || link.indexOf('dai.ly') != -1) {
        videoLink = 'https://www.dailymotion.com/embed/video/' + id;
      } else{
        this.iframEnable =false;
        videoLink = link;
      }
      if(this.iframEnable)
      setTimeout(() => {
        document.getElementById('videoIframe').setAttribute('src', videoLink);
      }, 200);
  }
  }

}
