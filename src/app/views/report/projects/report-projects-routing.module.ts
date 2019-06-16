import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportProjectsComponent } from './report-projects.component';


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
        component: ReportProjectsComponent,
        data: {
          title: 'Horas por projetos'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportProjectsRoutingModule { }
