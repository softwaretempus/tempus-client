import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkillComponent } from './skill.component';


const routes: Routes = [
  {
    path: '',
    component: SkillComponent,
    data: {
      title: 'Habilidades'
    },
    children: [
      {
        path: '',
        redirectTo: 'habilidades'
      },
      {
        path: 'edicao',
        component: SkillComponent,
        data: {
          title: 'Edição'
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
