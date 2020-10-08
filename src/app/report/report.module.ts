import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { RawDataReportComponent } from './raw-data-report/raw-data-report.component';
import { MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, MatDialogModule, MatRadioModule, MatCheckbox, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryBasedReportComponent } from './query-based-report/query-based-report.component';
import { QueryFiltersComponent } from './query-filters/query-filters.component';
import { ReportComponent } from './report/report.component';
import { SortbyPipe } from './sortby.pipe';
import { TableModule } from 'lib-table/public_api';
import { DialogMessageComponent } from './dialog-message/dialog-message.component';
import { ColumnListModalComponent } from './column-list-modal/column-list-modal.component';
import { GetKeysPipe } from './get-keys.pipe';
import { QueryColumnListModalComponent } from './query-column-list-modal/query-column-list-modal.component';

@NgModule({
  entryComponents: [DialogMessageComponent, ColumnListModalComponent, QueryColumnListModalComponent],
  declarations: [RawDataReportComponent, QueryBasedReportComponent,
     QueryFiltersComponent, ReportComponent, SortbyPipe, DialogMessageComponent, ColumnListModalComponent, GetKeysPipe, QueryColumnListModalComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    TableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule
  ]
})
export class ReportModule { }
