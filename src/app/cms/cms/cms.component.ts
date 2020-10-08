import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GalleryService } from '../gallery.service';
import { NgForm } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { AppService } from 'src/app/app.service';
declare var $;

@Component({
  selector: 'app-gallery-upload',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {

  searchFilter: string;
  itemsPerPage: number = 5;
  p: number = 1;
  fileExtensionMessage: any;
  selectionsValue: any = {};
  resourceTypeId: any;
  fileExtensionValidationMessage: any;
  resourceService: GalleryService;
  filePath: any = [];
  extensionsDocument = ['pdf', 'docx', 'xlsx']
  extensionsImage = ['JPG', 'jpg', 'JPEG', 'jpeg', 'PNG', 'png']
  extensionsVideo = ['mp4', 'webm', 'mov']
  tableData: any
  tableColumn: any;
  uploadResourceTypeFile: any;
  documentup: any;
  imageup: any;
  videoup: any;
  selectedId: any;
  app: AppService;
  // uploadImageFiles: any = [
  //   {
  //     "filePath": "",
  //   }
  // ];

  /**@author - Satyameba Panda (satyameba@sdrc.co.in)
   * this stores all files which are uploaded to server and fetched from server
   */
  uploadedFiles: any[] = [];

  /**@author - Satyameba Panda (satyameba@sdrc.co.in)
   * if true defines one of the previous data getting edited
   * if false defines new publish
   */
  editModeOn: boolean = false;

  /**@author - Satyameba Panda (satyameba@sdrc.co.in)
   * holds all the filepaths fetched from server or uploaded
   */
  uploadedFilePaths: any[] = [];

  fileExtension: any;
  uploadFileDetails: any = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  tags: any = [];
  videoUrl = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/
  videoRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$|^(?:https?:\/\/)?(?:www\.)?dailymotion.com\/(video|hub)+(\/([^_]+))?[^#]*(‪#‎video‬=([^_&]+))?$|^(?:https?:\/\/)?(?:www\.)?vimeo.com\/([0-9]+)$/
    ;
  uploadImg: boolean = false;
  data: any;
  uploadedImageFiles: any = [];
  selectedStoryId: string;
  validationMsg: any;
  nameRegex = /^[^-\s][a-zA-Z0-9\s-]{1,50}$/;
  uploadImgIndex: any;
  allResourceTypes: any;
  selectedResourceTypeId: any;

  constructor(private resourceProvider: GalleryService, private router: Router, private appProvider: AppService) {
    this.resourceService = resourceProvider;
    this.app = appProvider;
  }
  ngOnInit() {
    this.getAllData();
    this.resourceService.getResourceTypeDetails().subscribe(res => {
      this.allResourceTypes = res['Gallery Type'];;
    })
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
  getAllData() {
    this.resourceService.getAllData().subscribe(res => {
      let data = res;
      this.tableColumn = data['tableColumn'];
      this.tableData = data['tableData'];
    })
  }
  clearSearchText() {
    this.searchFilter = "";
  }
  publishData(form: NgForm) {
    let fileDetails: any = [];
    this.uploadImg = false;
    if (this.uploadedFilePaths.length) {
      for (let i = 0; i < this.uploadedFilePaths.length; i++) {
        const el = this.uploadedFilePaths[i];
        fileDetails.push(
          {
            "filepath": el.path
          });
      }

    } else {
      for (let index = 0; index < this.uploadedFiles.length; index++) {
        fileDetails.push(
          {
            "filepath": this.uploadedFiles[index],
          });
      }
    }

    this.uploadedFilePaths = [];
    let tagNames: any = [];
    for (let i = 0; i < this.tags.length; i++) {
      tagNames.push(this.tags[i].name)
    }

    let storyDetails = {
      "caption": this.selectionsValue.title,
      "description": null,
      "filepathCaptionModel": fileDetails,
      "videoLink": this.selectionsValue.vlink? this.selectionsValue.vlink: null,
      "tags": tagNames,
      "galleryType": this.resourceTypeId,
      "slugId": this.selectedResourceTypeId,
      "id": this.selectedStoryId? this.selectedStoryId : null
    }
    if (this.editModeOn) {
      // storyDetails.id = this.selectionsValue.id;
    }

    this.resourceService.saveResources(storyDetails).subscribe(data => {
      $('#publishedSuccess').modal('show');
      form.resetForm();
      // this.uploadImageFiles = [{ "file_url": "" }];
      this.tags = [];
      this.data = [];
      this.getAllData();
    }, err => {
      $('#error').modal('show');
      form.resetForm();
      // this.uploadImageFiles = [{ "file_url": "" }]
      this.tags = [];
      this.data = [];
      this.getAllData();
    })
  }

  // addImages() {
  //   if ((this.uploadImageFiles.length + this.uploadedImageFiles.length)< 5)
  //     this.uploadImageFiles.push({
  //       "file_url": "",
  //     });
  // }
  deleteSelectedResource() {
    this.resourceService.deleteSelectedResourceDetails(this.selectedStoryId).subscribe(res => {
      this.validationMsg = res;
      $('#deleteResource').modal('hide');
      $('#deleteSuccess').modal('show');
      this.getAllData();
    }, err => {
      this.validationMsg = err.error.text;
      $('#deleteResource').modal('hide');
      $('#deleteSuccess').modal('show');
      this.getAllData();
    });
  }

  /**
   * @author - Satyameba Panda(satyameba@sdrc.co.in);
   *  @param file - document/image/video file which is going to be uploaded to server
   */
  uploadFile(file) {
    this.resourceService.uploadFile(file).subscribe(res => {
      this.uploadedFiles.push(res['body']);
      this.uploadedFilePaths.push({ caption: null, filePath: null, path: res['body'] })
      // this.uploadImageFiles[imgIndex].filePath = field.filePath;
    }, err => {
      // field.filePath = err.error.text;
      // this.uploadImageFiles[imgIndex].filePath = field.filePath;
    })
  }
  // resource type selection
  selectResourceType(type) {
    for (let index = 0; index < this.allResourceTypes.length; index++) {
      if (this.allResourceTypes[index].slugId == type) {
        this.resourceTypeId = this.allResourceTypes[index].id;
      }
    }
    this.selectionsValue.vlink = '';
    $('#uploadFile').val('');
    this.uploadedFilePaths = [];
    this.uploadedFiles = [];
  }
  /*file uploading -----------------------------------------------*/
  fileUpload(event, extension, fieldSize): any {
    // this.uploadedFiles = [];
    // this.uploadedFilePaths = [];
    const fileExtension = [];
    const file = event.target.files;
    for (let i = 0; i < file.length; i++) {
      fileExtension.push(file[i].name.split('.').pop());
    }
    const allowedExtensions = extension;
    let extensionNames = '';
    this.fileExtensionValidationMessage = '';
    if (allowedExtensions.length > 1) {
      extensionNames = '(';
      allowedExtensions.forEach(element => {
        extensionNames += element + '/';
      });
      extensionNames = extensionNames.substring(0, extensionNames.length - 1) + ")"
    } else {
      extensionNames = allowedExtensions[0];
    }
    if (this.isInArray(allowedExtensions, fileExtension)) {
      this.fileExtensionValidationMessage = '';
    } else {
      // this.reset();
      this.fileExtensionValidationMessage = "(only " + extensionNames + " files are accepted.)";
      $('#uploadFile').val('')
      setTimeout(() => {
        this.fileExtensionValidationMessage = '';
      }, 2000);
    }
    if (file) {
      if (this.isInArray(allowedExtensions, fileExtension) && !this.checkSize(file, fieldSize)) {
        // field.file = file[0];
        this.fileExtensionValidationMessage = "";
        for (let i = 0; i < file.length; i++) {
          this.uploadFile(file[i]);
        }


      } else {
        this.fileExtensionValidationMessage = "(only " + extensionNames + " files are accepted and no file should exceed " + fieldSize / 1000 + " KB)";
        $('#uploadFile').val('')
      }
      // $('#uploadFile').val('');
      //   event.srcElement.value = null;
      //   event.srcElement.value = "";
      setTimeout(() => {
        this.fileExtensionValidationMessage = '';
      }, 2000);
    } else {
      alert("Failed to load file");
    }
  }

  removeFromFilePath(index) {
    this.uploadedFilePaths.splice(index, 1)
  }

  /**
   * returns true if the received extensions are belongs to allowed extensions else false.
  */
  isInArray(allowedExtensions: string[], receivedExtensions: string[]): boolean {
    return allowedExtensions.filter(val => receivedExtensions.includes(val)).length == 0 && allowedExtensions.filter(val => receivedExtensions.includes(val.toUpperCase())).length == 0 ? false : true;
  }

  /**
   * returns
   * this function checks whether total file size exceeds the given size or not
  */
  checkSize(file: File[], fieldSize: number): boolean {
    let count = 0;
    let totalSize = 0;
    for (var i = 0; i < file.length; i++) {
      totalSize += file[i].size
    }
    if (totalSize > fieldSize) return true; else return false;
  }
  convertExtToAcceptString(exten: string[]): string {
    let acceptString: string = "";
    exten.forEach(element => {
      acceptString += ".".concat(element + ",")
    });
    return acceptString.substring(0, acceptString.length - 1);
  }
  resetForm(form: NgForm) {
    this.uploadedFilePaths = [];
    this.editModeOn = false;
    form.resetForm();
    this.p = 1;
    // this.uploadImageFiles = [{ "file_url": "" }];
    this.tags = [];
    this.data = [];
    this.selectedStoryId = "";
  }
  // deleteUploads() {
  //   if (this.uploadImageFiles.length > 1  || (this.uploadImageFiles.length && this.uploadedImageFiles.length))
  //     this.uploadImageFiles.pop({
  //       "filePath": "",
  //     })
  // }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push({ name: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove(tags: any): void {
    const index = this.tags.indexOf(tags);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  viewMore(news) {

    this.resourceService.viewResourceDetails(news.id).subscribe(res => {
      let filepathCaptionModel = [];
      let data = <any[]>res;
      data.forEach(el => {
        let temp = { filepath: el.path.split('resources/')[1], base64: el.filepath };
        filepathCaptionModel.push(temp);
      });
      news.filepathCaptionModel = filepathCaptionModel;
      this.resourceService.selectedResourceDetails = news;
      this.router.navigate(['/gallery-details']);
    })

    //window.open('whatsnewcontent');
  }
  getResourceSlugIdById(id) {
    for (let i = 0; i < this.allResourceTypes.length; i++) {
      const element = this.allResourceTypes[i];
      if (element.id == id) {
        return element.slugId;
      }
    }
  }
  editResourceDetails(resourceId, details) {
    this.selectedStoryId = resourceId;
    this.resourceTypeId = details.galleryTypeId;
    this.editModeOn = true;
    this.tags = [];
    this.selectionsValue.title = details.caption;
    this.selectionsValue.id = details.id;
    this.selectionsValue.desc = details.description;
    this.selectedResourceTypeId = this.getObjectById('id', details.galleryTypeId, this.allResourceTypes).slugId;
    this.selectionsValue.vlink = details.videoLink;
    if (details.tag) {
      for (let i = 0; i < details.tag.length; i++) {
        this.tags.push({ 'name': details.tag[i] });
      };
    }

    this.resourceService.viewResourceDetails(resourceId).subscribe(res => {

      this.data = res;
      this.uploadedFilePaths = <any[]>res;
    })


  }
  //  deleteUploadedImages(selectImgIndex){   
  //   if (selectImgIndex > -1) {
  //     this.data.splice(selectImgIndex, 1); 
  //     this.uploadedImageFiles.splice(selectImgIndex, 1);   
  //   }
  //   if(this.data.length==0)
  //   this.uploadImageFiles = [{ "file_url": "" }];
  //  }
  openModalOnDeleteClick(resourceId) {
    this.selectedStoryId = resourceId;
    $('#deleteResource').modal('show');
  }
  //  deleteSelectedStory(){
  //   this.resourceService.deleteSelectedResourceDetails(this.selectedStoryId).subscribe(res => {
  //     this.validationMsg=res;
  //     $('#deleteResource').modal('hide');
  //     $('#deleteSuccess').modal('show');
  //     this.getAllData();
  //   },err=>{   
  //     this.validationMsg=err.error.text;
  //     $('#deleteResource').modal('hide');  
  //     $('#deleteSuccess').modal('show');
  //     this.getAllData();
  //   }); 
  //  }

  /**
   * @author Laxman Paikaray(laxman@sdrc.co.in)
   * It return object from the array comapring with key
   * @param key - name of the key
   * @param kayValue - name of the value of the key
   * @param arr - array of object
   */
  getObjectById(key, keyValue, arr) {
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      if (el[key] == keyValue) {
        return el;
      }
    }
    return null;
  }

  openModalOnApproveClick(id) {
    $('#approveResource').modal('show');
    this.selectedStoryId = id;
  }
  approve() {
    this.resourceService.approveSelectedResourceDetails(this.selectedStoryId).subscribe(res => {
      this.validationMsg = res;
      $('#approveResource').modal('hide');
      $('#error').modal('show');
      this.getAllData();
    }, err => {
      this.validationMsg = err.error.text;
      $('#approveResource').modal('hide');
      $('#approveSuccess').modal('show');
      this.getAllData();
    });
  }
}
