import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { AgendamentoComponent } from './agendamento.component';
import { AgendamentoRoutingModule } from './agendamento-routing.module';
import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';

@NgModule({
  imports: [
    AgendamentoRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ScheduleAllModule,
    FormsModule
  ],
  declarations: [
    AgendamentoComponent,    
  ]
})
export class AgendamentoModule { }
