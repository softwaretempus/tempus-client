import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtendimentoComponent } from './atendimento.component';
import { AtendimentoEditComponent } from './atendimento-edit.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Atendimentos'
    },
    children: [
      {
        path: '',
        redirectTo: 'atendimento',
      },
      {
        path: '',
        component: AtendimentoComponent,
        data: {
          title: 'Consulta'
        }
      },
      {
        path: ':id/edicao',
        component: AtendimentoEditComponent,
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
export class AtendimentoRoutingModule { }
