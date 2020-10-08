import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Covid19TrackerEntryComponent } from '@src/app/data-entry/components/covid19-tracker-entry/covid19-tracker-entry.component';
const routes: Routes = [
  { path: '', component: Covid19TrackerEntryComponent, pathMatch: 'full' },
  { path: 'data-entry', component: Covid19TrackerEntryComponent, pathMatch: 'full' },
  { path: 'data-entry-view', component: Covid19TrackerEntryComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataEntryRoutingModule { }
