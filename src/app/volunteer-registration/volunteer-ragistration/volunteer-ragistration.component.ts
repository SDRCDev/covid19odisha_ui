import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { CustomValidatorsService } from '../services/custom-validators.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { VolunteerRegistrationService } from '../services/volunteer-registration.service';
import { MatDialog } from '@angular/material';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import { Router } from '@angular/router';
import { AppService } from '@src/app/app.service';
declare var $:any

@Component({
  selector: 'app-volunteer-ragistration',
  templateUrl: './volunteer-ragistration.component.html',
  styleUrls: ['./volunteer-ragistration.component.scss']
})
export class VolunteerRagistrationComponent implements OnInit {

  mobile: any;
  touchedField;
  vrService: VolunteerRegistrationService;
  app: AppService;
  constructor(private vrProvider: VolunteerRegistrationService, private dialog: MatDialog, private appservice: AppService) {
    this.vrService = vrProvider;
    this.app = appservice;
  }

  ngOnInit() {
    
  }

  getRegistrationStatus() {
    this.vrService.getRegistrationStatus(this.mobile,this.app.langSelection).subscribe(res => {
      // if(res['notactive']) {
      const dialogRef = this.dialog.open(DialogMessageComponent,
        { width: '400px', disableClose: true, data: {header: 'Info', msg: res['message'], button: 'Ok' } });

    // }
    })
  }
}
