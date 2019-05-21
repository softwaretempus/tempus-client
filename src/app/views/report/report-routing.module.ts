import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportComponent } from './report.component';
// import { SkillEditComponent } from './skill-edit.component';


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
        component: ReportComponent,
        data: {
          title: 'Consulta'
        }
      },
      // {
      //   path: ':id/edicao',
      //   component: SkillEditComponent,
      //   data: {
      //     title: 'Formulário'
      //   }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
