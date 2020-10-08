import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmsComponent } from './cms/cms.component';
import { RoleGuardGuard } from '../guard/role-guard.guard';
import { GalleryDetailsComponent } from './gallery-details/gallery-details.component';
// import { GalleryLandingComponent } from './gallery-landing/gallery-landing.component';
import { HomeUserfulLinkComponent } from '@src/app/cms/home-userful-link/home-userful-link.component';
import { HomeResourceComponent } from '@src/app/cms/home-resource/home-resource.component';
import { GalleryLandingComponent } from '@src/app/cms/gallery-landing/gallery-landing.component';
import { ResourceComponent } from '@src/app/cms/resource/resource.component';
import { ImportantLinksUploadComponent } from '@src/app/cms/important-links-upload/important-links-upload.component';
import { ResourceDetailsComponent } from '@src/app/cms/resource-details/resource-details.component';
import { AuthGuard } from '../guard/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full', 
    component: CmsComponent, 
    canActivate: [AuthGuard],
    // data: { 
    //   expectedRoles: ["SUCCESS_STORY_ADMIN","SUCCESS_STORY_PARTNER_ADMIN"]
    // },
  },
  {
    path: 'gallery', 
    pathMatch: 'full', 
    component: GalleryLandingComponent, 
  },
  {
    path: 'gallery-details', 
    pathMatch: 'full', 
    component: GalleryDetailsComponent, 
  },
  {
    path:'resources',
    pathMatch: 'full',
    component: ResourceComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'important-links',
    pathMatch: 'full',
    component: ImportantLinksUploadComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'important-links-view',
    pathMatch: 'full',
    component: HomeUserfulLinkComponent
  },
  {
    path:'resources-view',
    pathMatch: 'full',
    component: HomeResourceComponent
  },
  {
    path:'resource-details',
    pathMatch: 'full',
    component: ResourceDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
