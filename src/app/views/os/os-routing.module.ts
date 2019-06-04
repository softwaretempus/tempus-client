import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OsComponent } from './os.component';
import { OsEditComponent } from './os-edit.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ordens de Serviços'
    },
    children: [
      {
        path: '',
        redirectTo: 'os'
      },
      {
        path: '',
        component: OsComponent,
        data: {
          title: 'Consulta'
        }
      },
      {
        path: ':id/edicao',
        component: OsEditComponent,
        data: {
          title: 'Formulário'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OsRoutingModule { }
