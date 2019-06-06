import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutComponent } from './logout.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Logout'
    },
    children: [
      {
        path: '',
        redirectTo: 'logout'
      },
      {
        path: '',
        component: LogoutComponent,
        data: {
          title: 'Confirmação'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogoutRoutingModule { }
