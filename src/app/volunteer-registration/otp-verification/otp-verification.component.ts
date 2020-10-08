import { Component, OnInit, ViewChild } from '@angular/core';
import { VolunteerRegistrationService } from '../services/volunteer-registration.service';
import { Router } from '@angular/router';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
declare var $;

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {

  digit1: any = "";
  digit2: any = "";
  digit3: any = "";
  digit4: any = "";
  digit5: any = "";
  digit6: any = "";
  sdrcForm: FormGroup;
  vrService: VolunteerRegistrationService
  siteKey: string = "6LcPu-cUAAAAAJjw6-_OynHKLextwKRI6Ec4SZ_B"
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  constructor(private vrProvider: VolunteerRegistrationService, private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog) {
    this.vrService = vrProvider;
    this.sdrcForm = this.formBuilder.group({
      digit1: ['', [Validators.required]],
      digit2: ['', [Validators.required]],
      digit3: ['', [Validators.required]],
      digit4: ['', [Validators.required]],
      digit5: ['', [Validators.required]],
      digit6: ['', [Validators.required]],
      recaptcha: ['', [Validators.required]]
    })
   }

  ngOnInit() {
    if(!this.vrService.regFormData) {
      this.router.navigateByUrl("volunteer-registration")
    }
  }

  nextBox(event) {
    let index = $(event.target).attr("id").split("-")[1];
    // $("#digit-"+(index+1)).select();
    if(event.target.value != ""){
      document.getElementById("digit-"+(parseInt(index)+1)).focus()
    } 
    // else {
    //   if(event.key == "Backspace"){
    //     document.getElementById("digit-"+(parseInt(index)-1)).focus()
    //   }
    // }
    
  }

  resendOTP() {
    this.vrService.resendOTP({"mobile": this.vrService.regFormData.mobile}).subscribe(res => {
      const dialogRef = this.dialog.open(DialogMessageComponent,
        { width: '400px', disableClose: true, data: {header: 'Success', msg: 'New OTP sent to the mobile number', button: 'Ok' } });
    })
  }

  verify(f) {
    let data = {
      "otp": this.digit1.toString()+ this.digit2.toString()+this.digit3.toString()+this.digit4.toString()+this.digit5.toString()+this.digit6.toString(),
      "mobile": this.vrService.regFormData.mobile,
      "id": this.vrService.regFormId
    }
    this.vrService.verifyOtp(data).subscribe(res => {
      f.resetForm()
      this.captchaElem.resetCaptcha();

      if(res['status'] == "mobile_number_error") {
        const dialogRef = this.dialog.open(DialogMessageComponent,
          { width: '400px', disableClose: true, data: { header: 'Error', msg: 'This mobile number does not exist', button: 'Ok' } });
      } else if(res['status'] == "duplicate_mobile_number") {
        const dialogRef = this.dialog.open(DialogMessageComponent,
          { width: '400px', disableClose: true, data: { header: 'Error', msg: 'This mobile number is already linked with another account', button: 'Ok' } });
      }  else if(res['isValid'] == true) {
        const dialogRef = this.dialog.open(DialogMessageComponent,
          { width: '400px', disableClose: true, data: { link: '', header: 'Success', msg: 'Registered successfully', button: 'Ok' } });
      }else {
        const dialogRef = this.dialog.open(DialogMessageComponent,
          { width: '400px', disableClose: true, data: { header: 'Error', msg: 'Provided OTP is wrong', button: 'Ok' } });
      }
      
    }, err => {
      const dialogRef = this.dialog.open(DialogMessageComponent,
        { width: '400px', disableClose: true, data: { header: 'Error', msg: 'Some server issue occured', button: 'Ok' } });
    })
  }
}
