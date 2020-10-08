import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guard/auth.guard';
import { RoleGuardGuard } from '../guard/role-guard.guard';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskViewComponent } from './task-view/task-view.component';

const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full', 
    component: TaskListComponent, 
    canActivate: [AuthGuard],
  },
  {
    path: 'view-task-details', 
    pathMatch: 'full', 
    component: TaskViewComponent, 
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignTaskRoutingModule { }
