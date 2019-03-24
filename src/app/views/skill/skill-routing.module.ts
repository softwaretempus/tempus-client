import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkillComponent } from './skill.component';
import { SkillEditComponent } from './skill-edit.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Habilidades'
    },
    children: [
      {
        path: '',
        redirectTo: 'habilidades'
      },
      {
        path: '',
        component: SkillComponent,
        data: {
          title: 'Consulta'
        }
      },
      {
        path: ':id/edicao',
        component: SkillEditComponent,
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
export class SkillRoutingModule { }
