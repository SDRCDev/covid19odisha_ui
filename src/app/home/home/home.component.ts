import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { HomeService } from '../home.service';
import { Constants } from 'src/app/constants';
import { Router, NavigationEnd } from '@angular/router';
import { isArray } from 'util';
import { AppService } from '@src/app/app.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: []
})
export class HomeComponent implements OnInit {

  @HostListener("window:scroll", []) onWindowScroll() {
    this.scrollFunction();
  }
  homeService: HomeService;
  app: AppService
  twitter: any;
  registeredCountData = {
    "Volunteers Registered": 0,
    "InstitutionsRegistered": 0,
    "Districts": 0,
    "Blocks": 0
  };
  
  dashboardLeftPanelData: any;
  valueUpdate = false;
  constructor(private homeProvider: HomeService, private router: Router, private appService: AppService) {
    this.homeService = homeProvider;
    this.app = appService;
    this.initTwitterWidget();
    this.homeService.getImortantLinks().subscribe((res: any) => {
      this.homeService.newsDetails = isArray(res) ? res : [];
    })
    
  }
  ngOnInit() {
    this.twitter.unsubscribe();
    this.homeService.getQuickStarts().subscribe(() => { });
    this.homeService.getRegisterdCounts().subscribe((res: any) => {
      this.registeredCountData = res;
      this.registeredCountData = {
        "Volunteers Registered": res['Volunteers Registered'] || 0,
        "InstitutionsRegistered": res['InstitutionsRegistered'] || 0,
        "Districts": res['Districts'] || 0,
        "Blocks": res['Blocks'] || 0
      };
      setTimeout(() => {
        if ($('.count').offset()) {
          var oTop = $('.count').offset().top - window.innerHeight;
          if ($(window).scrollTop() > oTop) {
            this.valueUpdate = true;
            this.startCount();
          }
        }
      }, 200)
      // console.log("res", res);
    });
  }

  initTwitterWidget() {
    this.twitter = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        (<any>window).twttr = (function (d, s, id) {
          let js: any, fjs = d.getElementsByTagName(s)[0],
            t = (<any>window).twttr || {};
          if (d.getElementById(id)) return t;
          js = d.createElement(s);
          js.id = id;
          js.src = "https://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js, fjs);
          t._e = [];
          t.ready = function (f: any) {
            t._e.push(f);
          };

          return t;
        }(document, "script", "twitter-wjs"));

        if ((<any>window).twttr.ready())
          (<any>window).twttr.widgets.load();
      }
    });
  }

  

  startCount() {
    this.homeService.countLoaded = true;

    $('.count').each(function (index) {
      var size = $(this).text().split(".")[1] ? $(this).text().split(".")[1].length : 0;
      $(this).prop('Counter', 0).animate({
        Counter: $(this).text()
      }, {
          duration: 5000,
          easing: 'swing',
          step: function (now) {
            $(this).text(parseFloat(now).toFixed(size));
          }
        });
    });
    setTimeout(() => {
    }, 0)
  }

  ngAfterViewInit() {
    $(window).scroll(() => {

      if ($('.count').offset()) {
        var oTop = $('.count').offset().top - window.innerHeight;
        if (!this.homeService.countLoaded && this.valueUpdate && $(window).scrollTop() > oTop) {
          this.startCount();
        }
      }

    });
  }

  scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("myBtn").style.display = "block";
    } else {
      document.getElementById("myBtn").style.display = "none";
    }
  }
  topFunction() {
    $('html, body').animate({
      scrollTop: 0
    }, 2000);
  }
}
