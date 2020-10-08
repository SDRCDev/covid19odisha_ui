import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

import { MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule, MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThematicDashboardComponent } from './thematic-dashboard/thematic-dashboard.component';
import { SortPipePipe } from '@src/app/home/sort-pipe.pipe';
import { LebelFromKeyPipe } from '@src/app/home/table-name.pipe';


@NgModule({
  declarations: [HomeComponent, ThematicDashboardComponent, SortPipePipe, LebelFromKeyPipe],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
