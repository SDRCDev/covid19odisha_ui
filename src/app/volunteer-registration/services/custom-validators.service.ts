import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Constants } from '@src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService extends Validators {

  constructor() {
    super();
   }
  
  public static validateEmail(formControl: FormControl) {
    let email = formControl.value ? formControl.value.toString() : "";
    if(email) {
    let regx = new RegExp(Constants.regularExp.email);
    return regx.test(String(email).toLowerCase()) ? null : { pattern: true };
    } else {
      return null;
    }
  }
  public static validateMobileNo(formControl: FormControl) {
    let mobile = formControl.value ? formControl.value.toString() : "";
    if(mobile){
    let regx = new RegExp(Constants.regularExp.mobile);
    return regx.test(String(mobile)) ? null : { pattern: true };
    } else {
      return null;
    }
  }

  public static validatePincode(formControl: FormControl) {
    let pincode = formControl.value ? formControl.value.toString() : "";
    if(pincode) {
    let regx = new RegExp(Constants.regularExp.pincode);
    return regx.test(String(pincode)) ? null : { pattern: true };
    } else {
      return null;
    }
  }
}
