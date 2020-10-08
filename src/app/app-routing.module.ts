import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Exception404Component } from './exception404/exception404.component';
import { AuthGuard } from './guard/auth.guard';
import { LoggedinGuard } from '@src/app/guard/loggedin.guard';
import { LoginComponent } from '@src/app/login/login.component';
import { WorkinProgressComponent } from '@src/app/fragments/workin-progress/workin-progress.component';
import { Covid19TrackerEntryComponent } from '@src/app/data-entry/components/covid19-tracker-entry/covid19-tracker-entry.component';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { PermissionGuard } from '@src/app/guard/permission.guard';
// import { ChangePasswordComponent } from './change-password/change-password.component';
const routes: Routes = [
  {
    path: 'data-entry',
    loadChildren: './data-entry/data-entry.module#DataEntryModule',
    canActivate:[PermissionGuard]
  },
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
  },
  {
    path: 'volunteer-registration',
    loadChildren: './volunteer-registration/volunteer-registration.module#VolunteerRegistrationModule',
  },
  {
    path: 'report',
    loadChildren: './report/report.module#ReportModule',
  },
  {
    path: 'create-user',
    loadChildren: './usermangament/usermangament.module#UsermangamentModule',
    canActivate: [PermissionGuard]
  },
  {
    path: 'gallery-upload',
    loadChildren: './cms/cms.module#CmsModule',
  },
  {
    path: 'assign-task-list',
    loadChildren: './assign-task/assign-task.module#AssignTaskModule',
  },
  {
    path: 'exception',
    component: Exception404Component,
    pathMatch: 'full'
  },
  {
    path: 'report',
    component: WorkinProgressComponent,
    pathMatch: 'full'
  },
  { 
    path: 'login', 
    pathMatch: 'full', 
    component: LoginComponent,
    canActivate: [LoggedinGuard]
  },
  // { 
  //   path: 'covid19-tracker', 
  //   pathMatch: 'full', 
  //   component: Covid19TrackerEntryComponent,
  //   canActivate:[PermissionGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
