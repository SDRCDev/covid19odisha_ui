import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { VolunteerRegistrationService } from '../services/volunteer-registration.service';
import { AppService } from '@src/app/app.service';

@Component({
  selector: 'app-term-condition',
  templateUrl: './term-condition.component.html',
  styleUrls: ['./term-condition.component.scss']
})
export class TermConditionComponent implements OnInit {

  // termAgree: boolean;
  vrService: VolunteerRegistrationService
  app: AppService;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private vrProvider: VolunteerRegistrationService,private appservice: AppService) {
    this.vrService = vrProvider;
    this.app = appservice;
   }

  ngOnInit() {
    
  }

}
