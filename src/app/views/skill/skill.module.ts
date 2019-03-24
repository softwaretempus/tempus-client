import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { SkillComponent } from './skill.component';
import { SkillEditComponent } from './skill-edit.component';
import { SkillRoutingModule } from './skill-routing.module';

@NgModule({
  imports: [
    SkillRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    SkillComponent,
    SkillEditComponent
  ]
})
export class SkillModule { }
