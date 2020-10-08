import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatRadioModule, MatDatepickerModule, MatTabsModule, MatCheckboxModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { NgxPaginationModule } from 'ngx-pagination';

import { UsermangamentRoutingModule } from './usermangament-routing.module';
import { CreateuserComponent } from './createuser/createuser.component';
import { ManageuserComponent } from './manageuser/manageuser.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserSideMenuComponent } from './user-side-menu/user-side-menu.component';
import { UserPasswordChangeComponent } from './user-password-change/user-password-change.component';

import { UsermanagementService } from '@src/app/usermangament/services/usermanagement.service';

import { SortbyPipe } from './filters/sortby.pipe';
import { SearchTextPipe } from './filters/search-text.pipe';
import { TableDataFilterPipe } from './filters/table-data-filter.pipe';

@NgModule({
  declarations: [CreateuserComponent, ManageuserComponent, ChangePasswordComponent, UserSideMenuComponent, UserPasswordChangeComponent, SearchTextPipe, TableDataFilterPipe, SortbyPipe],
  imports: [
    CommonModule,
    UsermangamentRoutingModule,
    ReactiveFormsModule, FormsModule,
    MatInputModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatRadioModule, MatDatepickerModule, MatTabsModule, MatCheckboxModule, MatCardModule,
    NgxPaginationModule
  ],
  providers:[UsermanagementService]
})
export class UsermangamentModule { }
