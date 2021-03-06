import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgrxFormsModule } from 'ngrx-forms';

import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { SyncValidationPageComponent } from './sync-validation.component';
import { SyncValidationComponent } from './form/form.component';
import { reducer } from './sync-validation.reducer';

export const COMPONENTS = [
  SyncValidationPageComponent,
  SyncValidationComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgrxFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SyncValidationPageComponent },
    ]),

    StoreModule.forFeature('syncValidation', reducer),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class SyncValidationModule { }
