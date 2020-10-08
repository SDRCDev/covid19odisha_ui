import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardGuard } from '../guard/role-guard.guard';
import { AuthGuard } from '../guard/auth.guard';
import { CreateuserComponent } from '@src/app/usermangament/createuser/createuser.component';
import { ManageuserComponent } from '@src/app/usermangament/manageuser/manageuser.component';
import { ChangePasswordComponent } from '@src/app/usermangament/change-password/change-password.component';
import { UserPasswordChangeComponent } from './user-password-change/user-password-change.component';

const routes: Routes = [
  {
    path: '',
    component: CreateuserComponent,
    pathMatch: 'full',
    canActivate: [RoleGuardGuard],
    data: { 
      expectedRoles: ["USER_MGMT_ALL_API"]
    },
  },
  {
    path: 'manage-user',
    component: ManageuserComponent,
    pathMatch: 'full',
    canActivate: [RoleGuardGuard],
    data: { 
      expectedRoles: ["USER_MGMT_ALL_API"]
    },
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    pathMatch: 'full',
    canActivate: [RoleGuardGuard],
    data: { 
      expectedRoles: ["USER_MGMT_ALL_API"]
    },
  },
  {
    path: 'reset-password',
    component: UserPasswordChangeComponent,
    pathMatch: 'full',    
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsermangamentRoutingModule { }
