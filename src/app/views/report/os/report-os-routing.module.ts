import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportOsComponent } from './report-os.component';


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
        component: ReportOsComponent,
        data: {
          title: 'Ordens de serviços'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportOsRoutingModule { }
