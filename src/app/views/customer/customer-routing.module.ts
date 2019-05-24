import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { CustomerEditComponent } from './customer-edit.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Clientes'
    },
    children: [
      {
        path: '',
        redirectTo: 'clientes',
      },
      {
        path: '',
        component: CustomerComponent,
        data: {
          title: 'Consulta'
        }
      },
      {
        path: ':id/edicao',
        component: CustomerEditComponent,
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
export class CustomerRoutingModule { }
