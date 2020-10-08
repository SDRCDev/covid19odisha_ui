import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VolunteerRagistrationComponent } from './volunteer-ragistration/volunteer-ragistration.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';

const routes: Routes = [
  {
    path: '',
    component: VolunteerRagistrationComponent,
    pathMatch: 'full'
  },
  {
    path: 'verify-otp',
    component: OtpVerificationComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolunteerRegistrationRoutingModule { }
