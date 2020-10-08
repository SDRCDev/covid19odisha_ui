import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from '@src/app/app.service';

@Component({
  selector: 'app-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.scss']
})
export class DialogMessageComponent implements OnInit {
  app: AppService;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private appservice: AppService) {
    this.app = appservice;
   }

  ngOnInit() {
  }

}
