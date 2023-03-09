import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule, MatCardModule, MatButtonModule, MatListModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UserListComponent } from './user-list/userlist.component';

import { UsersRoutes } from './users.routing';
import { SharedModule } from 'app/shared/shared.module';
import { ChartsModule } from 'angular-bootstrap-md';
import { DemoMaterialModule } from 'app/shared/demo.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(UsersRoutes),
    MatIconModule,
    SharedModule,
    FlexLayoutModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    NgxDatatableModule,
  ],
  declarations: [
    UserListComponent
  ]
})

export class UsersModule { }
