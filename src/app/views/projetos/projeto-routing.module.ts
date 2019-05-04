import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjetoComponent } from './projeto.component';
import { ProjetoEditComponent } from './projeto-edit.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Projetos'
    },
    children: [
      {
        path: '',
        redirectTo: 'projetos',
      },
      {
        path: '',
        component: ProjetoComponent,
        data: {
          title: 'Consulta'
        }
      },
      {
        path: ':id/edicao',
        component: ProjetoEditComponent,
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
export class ProjetoRoutingModule { }
