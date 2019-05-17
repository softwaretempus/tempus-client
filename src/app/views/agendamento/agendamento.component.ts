import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { extend } from '@syncfusion/ej2-base'; 
import { ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { ScheduleComponent, DragAndDropService, TimelineViewsService, GroupModel, EventSettingsModel, ResizeService, View } from '@syncfusion/ej2-angular-schedule';
import { roomData } from './data';
/*
import { L10n, loadCldr} from '@syncfusion/ej2-base';
import * as numberingSystems from './numberingSystems.json';
import * as gregorian from './ca-gregorian.json';
import * as numbers from './numbers.json';
import * as timeZoneNames from './timeZoneNames.json';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
L10n.load({
  'pt': {
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