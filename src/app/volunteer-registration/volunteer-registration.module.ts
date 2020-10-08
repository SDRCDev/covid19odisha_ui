import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VolunteerRegistrationRoutingModule } from './volunteer-registration-routing.module';
import { VolunteerRagistrationComponent } from './volunteer-ragistration/volunteer-ragistration.component';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatDialogModule, MatTabsModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogMessageComponent } from './dialog-message/dialog-message.component';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { IndividualRagistrationComponent } from './individual-ragistration/individual-ragistration.component';
import { OrganizationalRagistrationComponent } from './organizational-ragistration/organizational-ragistration.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TermConditionComponent } from './term-condition/term-condition.component';
import { TrimActiveDirective } from './directives/trim-active.directive';
import { SortbyPipe } from './sortby.pipe';
import { OtpboxDirective } from './directives/otpbox.directive';
import { NgxImageCompressService } from 'ngx-image-compress';

@NgModule({
  entryComponents: [DialogMessageComponent, TermConditionComponent],
  declarations: [VolunteerRagistrationComponent, DialogMessageComponent, OnlyNumberDirective, OtpVerificationComponent, IndividualRagistrationComponent, OrganizationalRagistrationComponent, TermConditionComponent, TrimActiveDirective, SortbyPipe, OtpboxDirective],
  providers: [NgxImageCompressService],
  imports: [
    CommonModule,
    VolunteerRegistrationRoutingModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatDialogModule,
    MatTabsModule,
    MatCheckboxModule,
    NgxCaptchaModule,
  ]
})
export class VolunteerRegistrationModule { }
