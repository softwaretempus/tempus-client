import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportUsersComponent } from './report-users.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Relatórios'
    },
    children: [
      {
        path: '',
        redirectTo: 'relatorios'
      },
      {
        path: '',
        component: ReportUsersComponent,
        data: {
          title: 'Horas por usuários'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportUsersRoutingModule { }
