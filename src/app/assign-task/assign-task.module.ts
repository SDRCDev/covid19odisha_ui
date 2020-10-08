import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatNativeDateModule, MatRadioModule , MatCardModule, MatTooltipModule, MatTabsModule, MatDatepickerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { NgxPaginationModule } from 'ngx-pagination';

import { AssignTaskRoutingModule } from './assign-task-routing.module';
import { TaskAssignService } from '@src/app/assign-task/services/task-assign.service';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { QueryFiltersComponent } from './query-filters/query-filters.component'
import { OnlyNumberDirective } from './directives/only-number.directive';
import { SearchTextPipe } from './filters/search-text.pipe';
import { SearchDisableTextPipe } from './filters/search-disable-text.pipe';
import { SortbyPipe } from './filters/sortby.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrgQueryFiltersComponent } from './org-query-filters/org-query-filters.component';
import { OrgTaskViewComponent } from './org-task-view/org-task-view.component';

@NgModule({
  declarations: [TaskListComponent, TaskViewComponent, SearchTextPipe, SortbyPipe, SearchDisableTextPipe, QueryFiltersComponent, OnlyNumberDirective, OrgQueryFiltersComponent, OrgTaskViewComponent],
  imports: [
    CommonModule,
    AssignTaskRoutingModule,
    ReactiveFormsModule, FormsModule,
    NgxPaginationModule, MatTabsModule, MatDatepickerModule,
    MatInputModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatCardModule,MatNativeDateModule, MatRadioModule,MatTooltipModule
  ],
  providers:[TaskAssignService]
})
export class AssignTaskModule { }
