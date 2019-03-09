import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'users', component: UserListComponent },
      { path: 'users/:id', component: UserDetailComponent },
    ]),
  ]
})
export class UserModule { }
