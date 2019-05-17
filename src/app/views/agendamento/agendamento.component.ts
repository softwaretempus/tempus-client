import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { extend } from '@syncfusion/ej2-base'; 
import { ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { ScheduleComponent, DragAndDropService, TimelineViewsService, GroupModel, EventSettingsModel, ResizeService, View } from '@syncfusion/ej2-angular-schedule';
import { roomData } from './data';

import { L10n, loadCldr, setCulture} from '@syncfusion/ej2-base';
setCulture('pt');
loadCldr(
  require('../../../../node_modules/cldr-data/supplemental/numberingSystems.json'),
  require('../../../../node_modules/cldr-data/main/pt/ca-gregorian.json'),
  require('../../../../node_modules/cldr-data/main/pt/currencies.json'),
  require('../../../../node_modules/cldr-data/main/pt/numbers.json'),
  require('../../../../node_modules/cldr-data/main/pt/timeZoneNames.json')
);

L10n.load({
  'pt': {
      'schedule': {
         "day": "Dia",
        "week": "Semana",
        "workWeek": "Semana de trabalho",
        "month": "Mês",
        "agenda": "Agenda",
        "weekAgenda": "Agenda da semana",
        "workWeekAgenda": "Agenda da semana de trabalho",
        "monthAgenda": "Agenda do mês",
        "today": "Hoje",
        "noEvents": "Sem agendamentos",
        "emptyContainer": "Vazio",
        "allDay": "O dia todo",
        "start": "Início",
        "end": "Fim",
        "more": "mais",
        "close": "Fechar",
        "cancel": "Cancelar",
        "noTitle": "(Sem título)",
        "delete": "Excluir",
        "deleteEvent": "Excluir agendamento",
        "deleteMultipleEvent": "Excluir múltiplos agendamentos",
        "selectedItems": "Itens selecionados",
        "deleteSeries": "Excluir Série",
        "edit": "Editar",
        "editSeries": "Editar série",
        "editEvent": "Editar agendamento",
        "createEvent": "Criar agendamento",
        "subject": "Assunto",
        "addTitle": "Adicionar título",
        "moreDetails": "Mais detalhes",
        "save": "Salvar",
        "editContent": "Gostaria de editar apenas esse agendamento ou a série inteira?",
        "deleteRecurrenceContent": "Deseja excluir apenas este agendamento ou uma série inteira?",
        "deleteContent": "Tem certeza de que deseja excluir este agendamento?",
        "deleteMultipleContent": "Tem certeza de que deseja excluir os agendamentos selecionados?",
        "newEvent": "Novo agendamento",
        "title": "Título",
        "location": "Localização",
        "description": "Descrição",
        "timezone": "Fuso horário",
        "startTimezone": "Início do fuso horário",
        "endTimezone": "Fim do fuso horário",
        "repeat": "Repetir",
        "saveButton": "Salvar",
        "cancelButton": "Cancelar",
        "deleteButton": "Deletar",
        "recurrence": "Recorrência",
        "wrongPattern": "O padrão de recorrência é inválido.",
        "seriesChangeAlert": "As alterações feitas em instâncias específicas desta série serão revertidas e esses agendamentos serão revertidos para a série.",
        "createError": "A duração do agendamento deve ser menor que sua frequência. Encurte a duração ou modifique o padrão de recorrência no editor de agendamentos de recorrência.",
        "recurrenceDateValidation": "Alguns meses têm menos que a data selecionada. Para esses meses, o agendamento ocorrerá no último dia do mês.",
        "sameDayAlert": "Duas ocorrências do mesmo agendamento não podem ocorrer no mesmo dia.",
        "editRecurrence": "Alterar recorrência",
        "repeats": "Repetições",
        "alert": "Alertas",
        "startEndError": "A data final selecionada ocorre antes da data de início.",
        "invalidDateError": "O valor da data introduzido é inválido.",
        "ok": "Ok",
        "occurrence": "Ocorrência",
        "series": "Séries",
        "previous": "Anterior",
        "next": "Próximo",
        "timelineDay": "Dia",
        "timelineWeek": "Semana",
        "timelineWorkWeek": "Semana de trabalho",
        "timelineMonth": "Mês"
      }
    }  
})  

//import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
//import * as gregorian from 'cldr-data/main/pt/ca-gregorian.json';
//import * as numbers from 'cldr-data/main/pt/numbers.json';
//import * as timeZoneNames from 'cldr-data/main/pt/timeZoneNames.json';

//setCulture('pt-PT');
//loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
/*
L10n.load({
  'pt-PT': {
      'schedule': {
          'day': 'Dia',
          'week': 'Semana',
          'workWeek': 'Semana de Trabalho',
          'month': 'Mês',
      }
  }
});
*/

@Component({
  templateUrl: 'agendamento.component.html',
  styleUrls: ['agendamento.component.css'],
  providers: [TimelineViewsService, ResizeService, DragAndDropService]
})
export class AgendamentoComponent {

  title: string = 'Agendamento'
  errorMessage: string;

  public scheduleObj: ScheduleComponent;
  public selectedDate: Date = new Date(2018, 7, 1);
  public rowAutoHeight: Boolean = true;
  public currentView: View = 'TimelineWeek';
  public group: GroupModel = {
    enableCompactView: false,
    resources: ['MeetingRoom']
  };
  public allowMultiple: Boolean = true;
  public resourceDataSource: Object[] = [
    { text: 'Bruno Sobral', id: 1, color: '#98AFC7' },
    { text: 'Gilvanleno', id: 2, color: '#99c68e' },
    { text: 'Bruno Calixto', id: 3, color: '#C2B280' },
    { text: 'Fabio Maia', id: 4, color: '#3090C7' },
    { text: 'Juliana Lira', id: 5, color: '#95b9' },    
  ];

  public eventSettings: EventSettingsModel = {
    dataSource: <Object[]>extend([], roomData, null, true),
    fields: {
      id: 'Id',
      subject: { name: 'Subject', title: 'Summary' },
      location: { name: 'Location', title: 'Location' },
      description: { name: 'Description', title: 'Comments' },
      startTime: { name: 'StartTime', title: 'From' },
      endTime: { name: 'EndTime', title: 'To' }
    }
  };
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,    
    private toastr: ToastrService
  ) { 

  }

  onChange(args: ChangeEventArgs): void {
    this.scheduleObj.rowAutoHeight = args.checked;
  }

}