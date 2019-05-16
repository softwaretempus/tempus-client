import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgendamentoComponent } from './agendamento.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Agendamentos'
    },
    children: [
      {
        path: '',
        redirectTo: 'agendamento',
      },
      {
        path: '',
        component: AgendamentoComponent,
        data: {
          title: 'Agendar'
        }
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendamentoRoutingModule { }
