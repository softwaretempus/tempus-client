import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { AtendimentoComponent } from './atendimento.component';
import { AtendimentoEditComponent } from './atendimento-edit.component';
import { AtendimentoRoutingModule } from './atendimento-routing.module';

@NgModule({
  imports: [
    AtendimentoRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    AtendimentoComponent,
    AtendimentoEditComponent
  ]
})
export class AtendimentoModule { }
