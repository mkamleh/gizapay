import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule, MatCardModule, MatButtonModule, MatListModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UserListMasterComponent } from './usermaster-list/usermasterlist.component';

import { UsersMasterRoutes } from './usersmaster.routing';
import { SharedModule } from 'app/shared/shared.module';
import { ChartsModule } from 'angular-bootstrap-md';
import { HttpModule } from '@angular/http';
import { DemoMaterialModule } from 'app/shared/demo.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(UsersMasterRoutes),
    MatIconModule,
    SharedModule,
    FlexLayoutModule,
    ChartsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    NgxDatatableModule,
  ],
  declarations: [
    UserListMasterComponent
  ]
})

export class UserMasterModule { }
