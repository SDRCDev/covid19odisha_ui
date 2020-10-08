import { Component, OnInit } from '@angular/core';
import { VolunteerRegistrationService } from '../services/volunteer-registration.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidatorsService } from '../services/custom-validators.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TermConditionComponent } from '../term-condition/term-condition.component';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import { ImageCompressorService } from '../services/image-compressor.service';
import { map, expand } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { AppService } from '@src/app/app.service';

@Component({
  selector: 'app-individual-ragistration',
  templateUrl: './individual-ragistration.component.html',
  styleUrls: ['./individual-ragistration.component.scss']
})
export class IndividualRagistrationComponent implements OnInit {

  sdrcForm: FormGroup;
  siteKey: string = "6Lc2hdAUAAAAAE6Ssx_3kQj9IiGju0wdsEGd5-Cu"
  regForm: any = {};
  profilePic: any
  profileImagePath: any;
  dropdownOptionsMap: any;
  allOptions: any;
  allDistricts: any = [];
  allStates: any = [];
  allCountries: any = [];
  allBlocks: any = [];
  allPS: any = [];
  allPreferredDistricts: any = [];
  allPreferredBlocks: any = [];
  allPreferredGP: any = [];
  vrService: VolunteerRegistrationService;
  volunteerCategories: any;
  fileValidationMessage: string;
  profilePicSelected: boolean;
  checkedProfilePic: boolean = false;
  termAgree: boolean = false;
  imgResultBeforeCompress: any;
  imgResultAfterCompress: any;
  app:AppService
  areaLevels = [
    {
      areaLevelId: 1,
      areaLevelName: "District Level"
    },
    {
      areaLevelId: 2,
      areaLevelName: "Block/City Level"
    },
    {
      areaLevelId: 3,
      areaLevelName: "Gram Panchayat Level"
    }
  ]
  constructor(private formBuilder: FormBuilder, private vrProvider: VolunteerRegistrationService, private dialog: MatDialog, private router: Router, private compressor: ImageCompressorService, private appservice: AppService) {
    this.vrService = vrProvider;
    this.app = appservice;
    this.sdrcForm = this.formBuilder.group({
      salutation: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      email: ['', [CustomValidatorsService.validateEmail]],
      mobile: ['', [CustomValidatorsService.validateMobileNo, Validators.required]],
      altMobile: ['', []],
      sex: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      district: ['', [Validators.required]],
      block: ['', [Validators.required]],
      ps: ['', []],
      locality: ['', []],
      landmark: ['', []],
      pincode: ['', []],
      qualification: ['', [Validators.required]],
      otherQualification: ['', []],
      specification: ['', []],
      vocational: ['', []],
      availability: ['', [Validators.required]],
      howVolunteer: ['', [Validators.required]],
      volunteerTime: ['', [Validators.required]],
      awareness: ['', []],
      fieldSupport: ['', []],
      experience: ['', []],
      ites: ['', []],
      consumables: ['', []],
      essentials: ['', []],
      health: ['', []],
      reliefCampMgmt: ['', []],
      volunteerOrganizations: ['', []],
      otherOrganizationName: ['', []],
      healthCareProfessionals: ['', []],
      areaLevel: ['', [Validators.required]],
      preferredDistrict: ['', []],
      preferredBlock: ['', []],
      preferredGP: ['', []],
      termAgree: ['', []],
      trained: ['', [Validators.required]],
      trainingName: ['', []],
      trainingDuration: ['', []],
      trainingOrganization: ['', []]
    });
  }

  ngOnInit() {
    this.dropdownOptionsMap = {
      salutation: [
        { id: 1, value: 'Mr.' },
        { id: 1, value: 'Mrs' },
        { id: 1, value: 'Miss' },
        { id: 1, value: 'Master' },
        { id: 1, value: 'Dr.' }
      ],
      sex: [
        { id: 1, value: 'Male' },
        { id: 1, value: 'Female' },
        { id: 1, value: 'Other' }
      ],
      qualification: [
        { id: 1, value: 'Graduation' }
      ]
    }
    this.getAllOptions()
    this.getAllCountries(1, -1)
    this.getAllPreferredDistricts(3, 2)
  }

  getAllCountries(areaLevelId, parentAreaId) {
    this.allStates = [];
    this.allDistricts = [];
    this.allBlocks = [];
    this.regForm = {}
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allCountries = res;
      if (this.allCountries.length == 1) {
        this.regForm.country = this.allCountries[0]
      }
    })
  }

  getAllStates(areaLevelId, parentAreaId) {
    this.allDistricts = [];
    this.allBlocks = [];
    this.allPS = [];
    this.regForm.district = undefined;
    this.regForm.block = undefined;
    this.regForm.ps = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allStates = res;
      if (this.allStates.length == 1) {
        this.regForm.state = this.allStates[0]
      }
    })
  }
  getAllDistricts(areaLevelId, parentAreaId) {
    this.allBlocks = [];
    this.allPS = [];
    this.regForm.ps = undefined;
    this.regForm.district = undefined;
    this.regForm.block = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allDistricts = res;
    })
  }



  getBlocks(areaLevelId, parentAreaId) {
    this.allPS = [];
    this.regForm.block = undefined;
    this.regForm.ps = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allBlocks = res;
    })
  }
  getPS(areaLevelId, parentAreaId) {
    this.regForm.ps = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPS = res;
    })
  }

  getAllPreferredDistricts(areaLevelId, parentAreaId) {
    this.allPreferredBlocks = [];
    this.regForm.preferredDistrict = undefined;
    this.regForm.preferredBlock = undefined;
    this.regForm.preferredGP = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredDistricts = res;
    })
  }
  getPreferredBlocks(areaLevelId, parentAreaId) {
    this.allPreferredGP = []
    this.regForm.preferredBlock = undefined;
    this.regForm.preferredGP = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredBlocks = res;
    })
  }

  getPreferredGP(areaLevelId, parentAreaId) {
    this.regForm.preferredGP = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredGP = res;
    })
  }

  getAllOptions() {
    this.vrService.getAllOptions().subscribe(res => {
      this.allOptions = res;
      this.volunteerCategories = [
        {
          name: "Public Awareness and Information",
          categories: this.allOptions['Public Awareness and Information']
        },
        {
          name: "On-field support",
          categories: this.allOptions['On-field support']
        },
        {
          name: "Technology/ITES",
          categories: this.allOptions['Technology/ITES']
        },
        {
          name: "Consumables/equipment",
          categories: this.allOptions['Consumables/equipment']
        },
        {
          name: "Essential Services",
          categories: this.allOptions['Essential Services']
        },
        {
          name: "Health",
          categories: this.allOptions['Health']
        }
      ];

    })
  }
  submit(f, sdrcForm) {
    if (this.profilePic) {
      sdrcForm.value.profilePic = this.profileImagePath;
    } else {
      this.profilePic = undefined;
    }
    this.checkedProfilePic = true;
    let payLoadData = this.formatPayloadData(sdrcForm.value)
    this.vrService.saveSubmission(payLoadData).subscribe(res => {
      if (res['status'] == "mobile_number_error") {
        const dialogRef = this.dialog.open(DialogMessageComponent,
          { width: '400px', disableClose: true, data: { header: 'Error', msg: 'This mobile number does not exist', button: 'Ok' } });
      } else if (res['status'] == "duplicate_mobile_number") {
        const dialogRef = this.dialog.open(DialogMessageComponent,
          { width: '400px', disableClose: true, data: { header: 'Error', msg: 'This mobile number is already linked with another account', button: 'Ok' } });
      } else {
        this.vrService.regFormData = sdrcForm.value;
        this.vrService.regFormId = res['id']
        f.resetForm()
        this.router.navigateByUrl("volunteer-registration/verify-otp")
      }
      // const dialogRef = this.dialog.open(DialogMessageComponent,
      //   { width: '400px', disableClose: true, data: { header: 'Success', msg: 'Registered Successfully', button: 'Ok' } });

    })
  }

  formatPayloadData(data) {
    let submitData = {
      "formId": 1,
      "salutation": data.salutation,
      "fullName": data.fullName,
      "email": data.email ? data.email : null,
      "mobile": data.mobile,
      "altMobile": data.altMobile ? data.altMobile : null,
      "sex": data.sex,
      "dob": data.dob,
      "profilePic": data.profilePic,
      "country": data.country.areaId,
      "state": data.state.areaId,
      "district": data.district.areaId,
      "block": data.block.areaId,
      "ps": data.ps? data.ps.areaId : null,
      "locality": data.locality ? data.locality : null,
      "landmark": data.landmark ? data.landmark : null,
      "pincode": data.pincode ? data.pincode : null,
      "areaLevel": data.areaLevel.areaLevelId,
      "preferredDistrict": data.areaLevel.areaLevelId == 1 ? this.getMultiSelectOptionIds(data.preferredDistrict, "areaId") : data.preferredDistrict.areaId,
      "preferredBlock": data.areaLevel.areaLevelId == 1 ? null : (data.areaLevel.areaLevelId == 2 ? this.getMultiSelectOptionIds(data.preferredBlock, "areaId") : data.preferredBlock.areaId),
      "preferredGP": data.areaLevel.areaLevelId == 1 || data.areaLevel.areaLevelId == 2 ? null : this.getMultiSelectOptionIds(data.preferredGP, "areaId"),
      "qualification": data.qualification,
      "otherQualification": data.otherQualification,
      "specification": data.specification ? data.specification : null,
      "experience": data.experience ? data.experience : null,
      "vocational": data.vocational ? data.vocational : null,
      "healthCareProfessionals": data.healthCareProfessionals ? data.healthCareProfessionals : null,
      "availability": data.availability,
      "howVolunteer": data.howVolunteer,
      "volunteerTime": data.volunteerTime,
      "volunteerOrganizations": data.volunteerOrganizations ? this.getMultiSelectOptionIds(data.volunteerOrganizations, "slugId") : null,
      "otherOrganizationName": data.otherOrganizationName,
      "awareness": data.awareness ? this.getMultiSelectOptionIds(data.awareness, "slugId") : null,
      "fieldSupport": data.fieldSupport ? this.getMultiSelectOptionIds(data.fieldSupport, "slugId") : null,
      "essentials": data.essentials ? this.getMultiSelectOptionIds(data.essentials, "slugId") : null,
      "health": data.health ? this.getMultiSelectOptionIds(data.health, "slugId") : null,
      "reliefCampMgmt": data.reliefCampMgmt ? this.getMultiSelectOptionIds(data.reliefCampMgmt, "slugId") : null,
      "trained": data.trained ? data.trained.slugId: null,
      "trainingName": data.trainingName ? data.trainingName: null,
      "trainingDuration": data.trainingDuration ? data.trainingDuration: null,
      "trainingOrganization": data.trainingOrganization ? data.trainingOrganization: null
    }
    return submitData;
  }
  getMultiSelectOptionIds(valArr, key) {
    let arr = [];    
    valArr.forEach(el => {
      arr.push(el[key])
    });
    if(valArr.length>0){
      return arr;
    }
    else{
      return null;
    }
  }
  scrollToError(): void {
    this.checkedProfilePic = true;
    const firstElementWithError = document.querySelector('form .ng-invalid');
    this.scrollTo(firstElementWithError);
  }
  scrollTo(el: Element) {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  uploadFile( file) {
    
    // console.log('input: '  + file.size);
    const compress = this.recursiveCompress( file ).pipe(
      expand(res => {
        return res.index > res.array.length - 1
          ? EMPTY
          : this.recursiveCompress( file );
      }),
    );
    compress.subscribe(res => {
      // console.log(res.size)
      this.vrService.uploadFile(res).subscribe(res => {
        this.profileImagePath = res['body'];
        // this.uploadImageFiles[imgIndex].filePath = field.filePath;
      }, err => {
        // field.filePath = err.error.text;
        // this.uploadImageFiles[imgIndex].filePath = field.filePath;
      })
    });
  }

  /*file uploading -----------------------------------------------------------------------------------------------------------------*/
  async fileUpload(event) {
    this.checkedProfilePic = true;
    var file = event.target.files[0];
    if (file) {
      this.profilePicSelected = true;
    } else {
      this.profilePicSelected = false;
      this.profilePic = undefined;
      return;
    }
    let fieldSize = 3145728;
    var allowedExtensions = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
    let extensionNames: string = "";
    if ((allowedExtensions).includes(file.name.split('.').pop())) {
      if(this.checkSize([file], fieldSize)) {

      } else {
        this.fileValidationMessage = "Image size should not exceed 3MB";
        this.profilePic = undefined;
        return;
      }
    } else {
      this.fileValidationMessage = "Please upload an image(.jpg, .png, .jpeg)";
      this.profilePic = undefined;
      return;
    }
    this.fileValidationMessage = undefined;
    this.uploadFile(file)
    this.profilePic = await this.toBase64(file).catch(e => Error(e))
    // let uploadFlag: boolean = false;
    // let uploadImgExt = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
    //     if ((uploadImgExt).includes(file.name.split('.').pop())) {
    //         uploadFlag = this.checkSize(file, 512000);
    //         this.uploadedFileExt = true;
    //     } else {
    //         this.uploadedFileExt = false;
    //     }
    // if (uploadFlag == false) {
    //     field.fileValues = [];
    //     this.fileExtension = [];

    //     for (var i = 0; i < file.length; i++) {
    //         this.fileExtension.push(file[i].name.split('.').pop());
    //     }

    //     if (allowedExtensions && allowedExtensions.length > 1) {
    //         extensionNames = "("
    //         allowedExtensions.forEach(element => {
    //             extensionNames += element + '/';
    //         });
    //         extensionNames = extensionNames.substring(0, extensionNames.length - 1) + ")"
    //     } else if (allowedExtensions) {
    //         extensionNames = allowedExtensions[0];
    //     }
    //     if (allowedExtensions && this.isInArray(allowedExtensions, this.fileExtension)) {
    //         this.fileExtensionMessage = ""
    //         this.fileExtensionValidationMessage = "";
    //     } else {
    //         //   this.reset();
    //         if (field.multiple) {
    //             field.fileExtensionValidationMessage = "(only " + extensionNames + " files are accepted.)";
    //             //this.fileExtValidationMessage =  "(only " + extensionNames + " files are accepted.)"
    //         } else {
    //             field.fileExtensionValidationMessage = "(" + extensionNames + ")";
    //             // this.fileExtValidationMessage =  "(" + extensionNames + ")";
    //         }
    //         if (!field.multiple)
    //             field.value = null;
    //         this.sdrcForm.controls[field.columnName].markAsTouched();
    //         this.sdrcForm.controls[field.columnName].setErrors({ 'required': true });
    //         return;
    //     }

    //     if (file && !this.checkSize(file, fieldSize)) {
    //         if (this.isInArray(allowedExtensions, this.fileExtension)) {

    //             this.currentFileUpload = true;
    //             for (let f of file) {
    //                 f["originalName"] = f.name;
    //                 field.fileValues.push(f);


    //             field.value = file;
    //             this.sdrcForm.get(field.columnName).setValue(field.value);

    //             field.fileExtensionValidationMessage = "";
    //         } else {
    //             field.value = null;
    //             this.sdrcForm.controls[field.columnName].setErrors({ 'required': true });
    //             if (field.multiple) {
    //                 field.fileExtensionValidationMessage = "(only " + extensionNames + " files are accepted and no file should exceed " + fieldSize / 1000 + " KB)";
    //                 this.fileExtValidationMessage = "(only " + extensionNames + " files are accepted and no file should exceed " + fieldSize / 1000 + " KB)";
    //             }
    //             else
    //                 // field.fileExtensionValidationMessage = "(" + extensionNames + " file within " + fieldSize / 1000 + " KB)";
    //                 this.fileExtValidationMessage = "(" + extensionNames + " file within " + fieldSize / 1000 + " KB)";
    //         }
    //     } else {
    //         event.srcElement.value = null;
    //         if (!field.multiple) {
    //             field.value = null;
    //             this.sdrcForm.controls[field.columnName].setErrors({ 'max': true });
    //         } else {
    //             //field.fileExtensionValidationMessage ='Please upload file within '+((fieldSize / 1000)/1000 + " MB");
    //             this.fileExtValidationMessage = 'Please upload file within 5 MB';
    //         }
    //         //this.sdrcForm.controls[field.columnName].setErrors({ 'max': true });               

    //     }
    // } else {
    //     event.srcElement.value = null;
    //     if (!field.multiple) {
    //         field.value = null;
    //         this.sdrcForm.controls[field.columnName].setErrors({ 'max': true });
    //     } else {
    //         //field.fileExtensionValidationMessage ="Please upload file within 500.00 KB."
    //         this.fileExtValidationMessage = "Please upload file within 500 KB.";
    //     }
    //     //this.sdrcForm.controls[field.columnName].setErrors({ 'max': true });

    // }
    // }
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  /**
   * this function checks whether any file exceeds the given size or not
   */
  checkSize(file: File[], fieldSize: number): boolean {
    let count = 0;
    for (var i = 0; i < file.length; i++) {
      if (file[i].size > fieldSize) count++;
    }
    if (count > 0) return false; else return true;
  }
  check(f) {
    // console.log(f)
  }

  /**
   * returns true if the received extensions are belongs to allowed extensions else false.
   */
  isInArray(allowedExtensions: string[], receivedExtensions: string[]): boolean {
    return allowedExtensions.filter(val => receivedExtensions.includes(val)).length == 0 ? false : true;
  }

  getPrevYrDate(yr) {
    var d = new Date();
    d.setFullYear(d.getFullYear() - yr);
    return d;
  }

  openTermConditionDialog() {
    const dialogRef = this.dialog.open(TermConditionComponent,
      { width: '500px', disableClose: true, data: { header: '', msg: '', button: 'Ok', termAgree: this.termAgree } });
  }

  isIdAvailable(arr, id, key) {
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      if(key) {
        if(el[key] == id) return true 
      } else {
        if(el == id) return true
      }
      
    }
    return false
  }


  recursiveCompress = (image: File) => {
    return this.compressor.compress(image).pipe (
      map(response => {

      //Code block after completing each compression
        // console.log('compressed ' + index + image.name);
        // this.compressedImages.push(response);
        return response;
      }),
    );
  }
}
