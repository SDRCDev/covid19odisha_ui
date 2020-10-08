import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidatorsService } from '../services/custom-validators.service';
import { VolunteerRegistrationService } from '../services/volunteer-registration.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TermConditionComponent } from '../term-condition/term-condition.component';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import { AppService } from '@src/app/app.service';

@Component({
  selector: 'app-organizational-ragistration',
  templateUrl: './organizational-ragistration.component.html',
  styleUrls: ['./organizational-ragistration.component.scss']
})
export class OrganizationalRagistrationComponent implements OnInit {

  sdrcForm: FormGroup;
  siteKey: string = "6Lc2hdAUAAAAAE6Ssx_3kQj9IiGju0wdsEGd5-Cu"
  regForm: any = {};
  profilePic: any
  dropdownOptionsMap: any;
  allOptions: any;
  allPreferredStates: any = [];
  allPreferredDistricts: any = [];
  allPreferredBlocks: any = [];
  allDistricts: any = [];
  allStates: any=[];
  allCountries: any = [];
  allBlocks: any = [];
  vrService: VolunteerRegistrationService;
  volunteerCategories: any;
  fileValidationMessage: string;
  profilePicSelected: boolean;
  checkedProfilePic: boolean = false;
  termAgree: boolean = false;
  app: AppService;
  areaLevels= [
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
    },
    {
      areaLevelId: 4,
      areaLevelName: "ULB Level"
    },
    {
      areaLevelId: 5,
      areaLevelName: "Village Level"
    }
  ]
  constructor(private formBuilder: FormBuilder, private vrProvider: VolunteerRegistrationService, private dialog: MatDialog, private router: Router, private appservice: AppService) { 
    this.vrService = vrProvider;
    this.app =appservice;
    this.sdrcForm = this.formBuilder.group({
      organizationName: ['', [Validators.required]],
      organizationType: ['', [Validators.required]],
      registrationNumber: ['', []],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      district: ['', [Validators.required]],
      landmark: ['', [Validators.required]],
      completeAddress: ['', [Validators.required]],
      contactPersonName: ['', [Validators.required]],
      contactPersonEmail: ['', [Validators.required, CustomValidatorsService.validateEmail]],
      mobile: ['', [Validators.required, CustomValidatorsService.validateMobileNo]],
      preferredCommunicationMethod: ['', [Validators.required]],
      serviceType: ['', [Validators.required]],
      areaOfService: ['', [Validators.required]],
      preferredState: ['', [Validators.required]],
      preferredDistrict: ['', []],
      preferredBlock: ['', []],
      termAgree: ['', []],
      serviceDetails: ['', [Validators.required]]
  });
  }

  ngOnInit() {
    this.dropdownOptionsMap = {
      salutation: [
        {id: 1, value: 'Mr.'},
        {id: 1, value: 'Mrs'},
        {id: 1, value: 'Miss'},
        {id: 1, value: 'Master'},
        {id: 1, value: 'Dr.'}
      ],
      sex: [
        {id: 1, value: 'Male'},
        {id: 1, value: 'Female'},
        {id: 1, value: 'Other'}
      ],
      qualification: [
        {id:1, value: 'Graduation'}
      ]
    }
    this.getAllOptions()
    this.getAllCountries(1, -1)
    this.getAllPreferredStates(2, 1)
  }

  getAllCountries(areaLevelId, parentAreaId) {
    this.allStates = [];
    this.allDistricts = [];
    this.allBlocks = [];
    this.regForm = {}
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allCountries = res;
      if(this.allCountries.length == 1) {
        this.regForm.country = this.allCountries[0]
      }
    })
  }

  getAllStates(areaLevelId, parentAreaId) {
    this.allDistricts = [];
    this.allBlocks = [];
    this.regForm.state = undefined;
    this.regForm.district = undefined;
    this.regForm.block = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allStates = res;
      if(this.allStates.length == 1) {
        this.regForm.state = this.allStates[0]
        }
    })
  }
  getAllPreferredStates(areaLevelId, parentAreaId) {
    this.allPreferredDistricts = [];
    this.allPreferredBlocks = [];
    this.regForm.preferredState = undefined;
    this.regForm.preferredDistrict = undefined;
    this.regForm.preferredBlock = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredStates = res;
    })
  }
  getAllDistricts(areaLevelId, parentAreaId) {
    this.allBlocks = [];
    this.regForm.district = undefined;
    this.regForm.block = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allDistricts = res;
    })
  }

  getAllPreferredDistricts(areaLevelId, parentAreaId) {
    this.allPreferredBlocks = [];
    this.regForm.preferredDistrict = undefined;
    this.regForm.preferredBlock = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredDistricts = res;
    })
  }

  getPreferredBlocks(areaLevelId, parentAreaId) {
    this.regForm.preferredBlock = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allPreferredBlocks = res;
    })
  }

  getBlocks(areaLevelId, parentAreaId) {
    this.regForm.block = undefined;
    this.vrService.getAreaDetails(areaLevelId, parentAreaId).subscribe(res => {
      this.allBlocks = res;
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
    if(this.profilePic) {
      sdrcForm.value.profilePic = this.profilePic;
    } else {
      this.profilePic = undefined;
    }
    let payLoadData = this.formatPayloadData(sdrcForm.value)
    this.checkedProfilePic = true;
    this.vrService.saveSubmission(payLoadData).subscribe(res => {
      if(res['status'] == "mobile_number_error") {
        const dialogRef = this.dialog.open(DialogMessageComponent,
          { width: '400px', disableClose: true, data: { header: 'Error', msg: 'Contact person mobile number does not exist', button: 'Ok' } });
      } else if(res['status'] == "duplicate_mobile_number") {
        const dialogRef = this.dialog.open(DialogMessageComponent,
          { width: '400px', disableClose: true, data: { header: 'Error', msg: 'Contact person mobile number is already linked with another account', button: 'Ok' } });
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

  scrollToError(): void {
    this.checkedProfilePic=true;
    const firstElementWithError = document.querySelector('form .ng-invalid');
    this.scrollTo(firstElementWithError);
  }
  scrollTo(el: Element) {
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  



  formatPayloadData(data) {
    let submitData = {
      "formId": 2,
      "organizationName": data.organizationName,
      "organizationType": data.organizationType,
      "registrationNumber": data.registrationNumber ? data.registrationNumber : null,
      "country": data.country.areaId,
      "state": data.state.areaId,
      "district": data.district.areaId,
      "landmark": data.landmark,
      "completeAddress": data.completeAddress,
      "contactPersonName": data.contactPersonName,
      "contactPersonEmail": data.contactPersonEmail,
      "mobile": data.mobile,
      "serviceType": data.serviceType,
      "serviceDetails": data.serviceDetails,
      "preferredCommunicationMethod": data.preferredCommunicationMethod,
      "areaOfService": data.areaOfService.slugId,
      "preferredState": data.preferredState.areaId,
      "preferredDistrict": data.areaOfService.slugId == 105 ? null: (data.areaOfService.slugId == 106 ? this.getMultiSelectOptionIds(data.preferredDistrict, "areaId") : data.preferredDistrict.areaId),
      "preferredBlock": data.areaOfService.slugId == 105 || data.areaOfService.slugId == 106  ? null : this.getMultiSelectOptionIds(data.preferredBlock, "areaId"),
      
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
check(f) {
  // console.log(f)
}
openTermConditionDialog() {
  const dialogRef = this.dialog.open(TermConditionComponent,
      { width: '500px', disableClose: true, data: { header: '', msg: '', button: 'Ok' } });
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


}
