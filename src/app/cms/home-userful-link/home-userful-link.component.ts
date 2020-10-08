import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StaticHomeService } from '../static-home.service';
import { DomSanitizer } from '@angular/platform-browser';
import { isArray } from 'util';
import { AppService } from '@src/app/app.service';

@Component({
  selector: 'app-home-userful-link',
  templateUrl: './home-userful-link.component.html',
  styleUrls: ['./home-userful-link.component.scss']
})
export class HomeUserfulLinkComponent implements OnInit {

  staticService: StaticHomeService;
  searchTexts:any;
  itemsPerPage: number = 10;
  p: number = 1;
  app: AppService

  constructor(private router: Router,
    private statichomeService: StaticHomeService,private sanitizer: DomSanitizer, private appservice:AppService) {
    this.staticService = statichomeService;
    this.app = appservice;
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.staticService.getusefulLink().subscribe((res) => {
      if(isArray(res)) {
        this.staticService.usefulData = res;
      }
    });;
  }
  redirectTousefullink() {
    this.router.navigate(['']);
  }

}
