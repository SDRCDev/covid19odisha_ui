import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-landing-side-menu',
  templateUrl: './landing-side-menu.component.html',
  styleUrls: ['./landing-side-menu.component.scss']
})
export class LandingSideMenuComponent implements OnInit {
  router: Router;
  app: AppService;
  
  constructor(router: Router, appService: AppService) {
    this.router = router;
    this.app = appService;
  }

  ngOnInit() {
  }
}


