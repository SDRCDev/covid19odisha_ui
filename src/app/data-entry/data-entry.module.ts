import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Covid19TrackerEntryComponent } from '@src/app/data-entry/components/covid19-tracker-entry/covid19-tracker-entry.component';
import { DataEntryService } from '@src/app/data-entry/services/data-entry.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatFormFieldModule, MatChipsModule, MatIconModule, MatTooltipModule, MatDialogModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatListModule, MatCardModule } from '@angular/material';
import { OnlyNumberDirective } from '@src/app/data-entry/only-number.directive';
import { TableNamePipe } from '@src/app/data-entry/table-name.pipe';

@NgModule({
  declarations: [Covid19TrackerEntryComponent, OnlyNumberDirective, TableNamePipe],
  providers:[DataEntryService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatListModule,
    MatCardModule,
    MatTooltipModule,
  ]
})
export class DataEntryModule { }
