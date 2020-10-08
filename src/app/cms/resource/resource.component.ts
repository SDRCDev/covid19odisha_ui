import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, NgForm, FormControl } from '@angular/forms';
import { LandingServiceService } from './landing-service.service';
import { MatChipInputEvent } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service';
declare var $:any;

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss', '../cms.common.scss']
})
export class ResourceComponent implements OnInit {
  searchFilter: string;
  itemsPerPage: number = 5;
  p: number = 1;
  fileExtensionMessage: any;
  selectionsValue: any = {};
  fileExtensionValidationMessage: any;
  resourceService: LandingServiceService;
  filePath: any = [];
  extensionsDocument = ['pdf'];
  allResourceTypes: any;
  selectedResourceTypeId: any; 
  tableData: any
  tableColumn: any;
  videoLinkRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$|^(?:https?:\/\/)?(?:www\.)?dailymotion.com\/(video|hub)+(\/([^_]+))?[^#]*(‪#‎video‬=([^_&]+))?$|^(?:https?:\/\/)?(?:www\.)?vimeo.com\/([0-9]+)$/;
  uploadImageFiles: any = [
    {
      "filePath": "",
    }
  ];
  fileExtension: any;
  uploadFileDetails: any = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  tags: any = [];
  videoUrl = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/
  uploadImg: boolean =false;
  data: any;
  uploadedImageFiles:any=[];
  selectedStoryId: string;
  resourceTypeId: any;
  validationMsg:any;
  nameRegex = /^[^-\s][a-zA-Z0-9\s-]{1,50}$/;
  uploadImgIndex:any;
  app: AppService;

  constructor(private resourceProvider: LandingServiceService, private router: Router, private appProvider: AppService) {
    this.resourceService = resourceProvider;
    this.app = appProvider;
  }
  ngOnInit() {
    this.getAllStories();
    this.resourceService.getResourceTypeDetails().subscribe(res =>{
      this.allResourceTypes = res['Resource Type'];
    })  
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
  getAllStories() {
    this.resourceService.getAllData().subscribe(res => {
      let data:any = res;
      this.tableColumn = data['tableColumn'];
      this.tableData = data['tableData'];
      // this.tableColumn = ["sl_No#Sl. No.","title#Title","resourceType#Resource Type","tag#Tags","publishedBy#Published By"] || res['tableColumn'];
      // this.tableData = [...data["Guidelines and Tools"], ...data["Documents"]] || res['tableData'];
    })
  }
  clearSearchText() {
    this.searchFilter = "";
  }
  // resource type selection
selectResourceType(type){
  for (let index = 0; index < this.allResourceTypes.length; index++) {
    if(this.allResourceTypes[index].slugId== type) {
      this.resourceTypeId = this.allResourceTypes[index].id;
    }
  }
}
  publishData(form: NgForm) {
    let fileDetails: any = [];
    for (let index = 0; index < this.uploadImageFiles.length; index++) {
      fileDetails.push(
        {
          "filepath": this.uploadImageFiles[index].filePath.body,

        });
    }
    if(this.data){
    for (let index = 0; index < this.data.length; index++) {
      fileDetails.push(
        {
          "filepath": this.data[index].path
        });
    }
    }
    let tagNames: any = [];
    for (let i = 0; i < this.tags.length; i++) {
      tagNames.push(this.tags[i].name)
    }

    let storyDetails = {
      "title": this.selectionsValue.title,
      "description": this.selectionsValue.desc,
      "filepathCaptionModel": fileDetails,
      "videoLink": this.selectionsValue.vlink,
      "tags": tagNames,
      "resourceType": this.resourceTypeId,
      "slugId": this.selectedResourceTypeId,
      "id": this.selectedStoryId?this.selectedStoryId:null
    }
    // if(this.editModeOn) {
    //   storyDetails.id = this.selectionsValue.id;
    // }

    this.resourceService.saveResources(storyDetails).subscribe(data => {
      $('#publishedSuccess').modal('show');
      form.resetForm();
      this.uploadImageFiles = [{ "image_url": "", "caption": "" }]
      this.tags = [];
      this.data = [];
      this.getAllStories();
    }, err => {
      $('#error').modal('show');
      form.resetForm();
      this.uploadImageFiles = [{ "image_url": "", "caption": "" }];
      this.tags = [];
      this.data = [];
      this.getAllStories();
    })
  }

  addImages() {
    if ((this.uploadImageFiles.length + this.uploadedImageFiles.length)< 5)
      this.uploadImageFiles.push({
        "image_url": "",
        "caption": ""
      });
  }

  uploadFile(field, file, imgIndex) {
    this.resourceService.uploadFile(file).subscribe(res => {
      field.filePath = res;
      this.uploadImageFiles[imgIndex].imagePath = field.filePath;
    }, err => {
      field.filePath = err.error.text;
      this.uploadImageFiles[imgIndex].imagePath = field.filePath;
    })
  }

  

  /*file uploading -----------------------------------------------------------------------------------------------------------------*/
  fileUpload(form, event, extension, field, fieldSize, imgIndex): any {
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
      if (field.multiple) {
        this.fileExtensionValidationMessage = "(only " + extensionNames + " files are accepted.)";
      } else {
        this.fileExtensionValidationMessage = "(required a " + extensionNames + " file.)";
      }
      setTimeout(() => {
        this.fileExtensionValidationMessage = '';
      }, 3000);
    }
    if (file) {
      if (this.isInArray(allowedExtensions, fileExtension) && !this.checkSize(file, fieldSize)) {
        field.file = file[0];
        this.fileExtensionValidationMessage = "";
        this.uploadFile(field, field.file, imgIndex)        
      } else {
        if (field.multiple)
          this.fileExtensionValidationMessage = "(only " + extensionNames + " files are accepted and no file should exceed " + fieldSize / 1000 + " KB)";
        else
          this.fileExtensionValidationMessage = "(required a " + extensionNames + " file within " + fieldSize / 1000 + " KB)";
          $('#uploadFile'+imgIndex.toString()).val('');
          this.uploadImgIndex = imgIndex;
          event.srcElement.value = null;
          event.srcElement.value = "";
          form.controls['uploadFile'+imgIndex.toString()].reset();
      }
      setTimeout(() => {
        this.fileExtensionValidationMessage = '';
      }, 3000);
    } else {
      alert("Failed to load file");
    }
  }
  /**
   * returns true if the received extensions are belongs to allowed extensions else false.
  */
  isInArray(allowedExtensions: string[], receivedExtensions: string[]): boolean {
    return allowedExtensions.filter(val => receivedExtensions.includes(val)).length == 0 && allowedExtensions.filter(val => receivedExtensions.includes(val.toUpperCase())).length == 0 ? false : true;
  }

  /**
   * this function checks whether any file exceeds the given size or not
  */
  checkSize(file: File[], fieldSize: number): boolean {
    let count = 0;
    for (var i = 0; i < file.length; i++) {
      if (file[i].size > fieldSize) count++;
    }
    if (count > 0) return true; else return false;
  }
  convertExtToAcceptString(exten:string[]):string{
    let acceptString: string = "";
    exten.forEach(element => {
        acceptString += ".".concat(element+",")
    });
    return acceptString.substring(0, acceptString.length-1);
 }
  resetForm(form: NgForm) {
    form.resetForm();
    this.p =1;
    this.uploadImageFiles = [{ "image_url": "", "caption": "" }];
    this.tags = [];
    this.data=[];
    this.selectedStoryId="";
  }
  deleteUploads() {
    if (this.uploadImageFiles.length > 1  || (this.uploadImageFiles.length && this.uploadedImageFiles.length))
      this.uploadImageFiles.pop({
        "imagePath": "",
        "caption": ""
      })
  }
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
  getObjectById(key, keyValue, arr) {
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      if(el[key] == keyValue) {
        return el;
      }
    }
    return null;
   }
   openModalOnApproveClick(id){
    $('#approveConfirm').modal('show');
    this.selectedStoryId = id;
 }
 approve(){
  this.resourceService.approveSelectedResourceDetails(this.selectedStoryId).subscribe(res => {
    this.validationMsg=res;
    $('#approveConfirm').modal('hide');
    $('#error').modal('show');
    this.getAllStories();
  },err=>{   
    this.validationMsg=err.error.text;
    $('#approveConfirm').modal('hide');
    $('#approveSuccess').modal('show');
    this.getAllStories();
  }); 
 }
  viewMore(news){

    this.resourceService.viewResourceDetails(news.id).subscribe(res => {
      let filepathCaptionModel = [];
      let data = <any[]> res;
      data.forEach(el => {
        let temp = {filepath: el.path};
        filepathCaptionModel.push(temp);
      });
      news.filepathCaptionModel = filepathCaptionModel;
      this.resourceService.selectedResourceDetails = news;
    this.router.navigate(['/resource-details']);
    })
    
    //window.open('whatsnewcontent');
  }
  editStoryDetails(storyId, details){   
    this.selectedStoryId = storyId; 
    this.resourceService.viewResourceDetails(storyId).subscribe(res => {
      this.data=res;
      this.uploadImg =true;
      this.uploadImageFiles =[];
      this.selectionsValue.title = details.title;
      this.selectionsValue.desc = details.description;
      this.selectionsValue.vlink = details.videoLink; 
      this.selectedResourceTypeId = this.getObjectById('id', details.resourceTypeId, this.allResourceTypes).slugId;  
      this.resourceTypeId = details.resourceTypeId;
      if(this.data){
        this.uploadedImageFiles =[];
        this.tags =[];
      for (let index = 0; index < this.data.length; index++) {
        this.uploadedImageFiles.push({
          "image_url": this.data[index].path,
          "caption": this.data[index].caption
        })
       }
      for(let i = 0; i < details.tag.length; i++)
       this.tags.push({'name': details.tag[i]})
      }    
     })
   }
   deleteUploadedImages(selectImgIndex){   
    if (selectImgIndex > -1) {
      this.data.splice(selectImgIndex, 1);     
      this.uploadedImageFiles.splice(selectImgIndex, 1);
    }
    if(this.data.length==0)
    this.uploadImageFiles = [{ "image_url": "", "caption": "" }];
   }
   openModalOnDeleteClick(storyId){
    this.selectedStoryId = storyId;
    $('#deleteStory').modal('show');
   }
   deleteSelectedStory(){
    this.resourceService.deleteSelectedResourceDetails(this.selectedStoryId).subscribe(res => {
      this.validationMsg=res;
      $('#deleteStory').modal('hide');
      $('#error').modal('show');
      this.getAllStories();
    },err=>{   
      this.validationMsg=err.error.text;
      $('#deleteStory').modal('hide');  
      $('#deleteSuccess').modal('show');
      this.getAllStories();
    }); 
   }   
}
   

