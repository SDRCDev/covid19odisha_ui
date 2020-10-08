import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatTooltipModule, MatNativeDateModule, MatChipsModule } from '@angular/material';
import { TableModule } from 'review-lib/public_api';

import { CmsRoutingModule } from './cms-routing.module';
import { CmsComponent } from './cms/cms.component';
import { LandingSideMenuComponent } from './landing-side-menu/landing-side-menu.component';
import { GalleryDetailsComponent } from './gallery-details/gallery-details.component';
import { HomeUserfulLinkComponent } from '@src/app/cms/home-userful-link/home-userful-link.component';
import { HomeResourceComponent } from '@src/app/cms/home-resource/home-resource.component';
import { GalleryLandingComponent } from '@src/app/cms/gallery-landing/gallery-landing.component';
import { ImportantLinksUploadComponent } from '@src/app/cms/important-links-upload/important-links-upload.component';
import { ResourceDetailsComponent } from './resource-details/resource-details.component';
import { ResourceComponent } from '@src/app/cms/resource/resource.component';

import { StaticHomeService } from '@src/app/cms/static-home.service';
import { LandingServiceService } from '@src/app/cms/resource/landing-service.service';

import { ReversePipe } from './reverse.pipe';
import { SearchPipePipe } from './search-pipe.pipe';
import { SearchTextPipe } from '@src/app/cms/search-text.pipe';
import { ImportantLinkReversePipe } from '@src/app/cms/important-links-upload/reverse.pipe';
import { ResourcesReversePipe } from '@src/app/cms/resource/reverse.pipe';

@NgModule({
  declarations: [
    CmsComponent, LandingSideMenuComponent, GalleryDetailsComponent,
     HomeUserfulLinkComponent,
     HomeResourceComponent,
     GalleryLandingComponent,
     ResourceComponent,
     ImportantLinksUploadComponent,
     /* PIPES */
     GalleryLandingComponent,
     SearchTextPipe,
     SearchPipePipe,
     ReversePipe,
     ImportantLinkReversePipe,
     ResourcesReversePipe,
     ResourceDetailsComponent,
    ],  
  imports: [
    CommonModule,
    CmsRoutingModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatChipsModule, MatIconModule, MatTooltipModule,
    TableModule,
    MatNativeDateModule,
    NgxPaginationModule,
    NgxImageGalleryModule,
    ReactiveFormsModule,FormsModule,
  ],
  providers:[
    StaticHomeService,
    LandingServiceService
  ]
})
export class CmsModule { }
