declare var require: any // para require funcionar.
import { Component } from '@angular/core';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { extend } from '@syncfusion/ej2-base';
import { Internationalization } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base'; 
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { ScheduleComponent, DragAndDropService, TimelineViewsService, GroupModel, EventSettingsModel, ResizeService, View, PopupOpenEventArgs, EventClickArgs } from '@syncfusion/ej2-angular-schedule';
import { roomData } from './data';
import { AtendimentoService } from '../atendimento/atendimento.service';
import { IAtendimento } from '../atendimento/Atendimento';

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

@Component({
  templateUrl: 'agendamento.component.html',
  styleUrls: ['agendamento.component.css'],
  providers: [TimelineViewsService, ResizeService, DragAndDropService],
})
export class AgendamentoComponent {

  title: string = 'Agendamento'
  errorMessage: string;

  atendimentos: IAtendimento[] = [];
  atendimentosCombo:  { [key: string]: Object }[];  

  public scheduleObj: ScheduleComponent;  
  public selectedDate: Date = new Date(); // Data padrão = hoje
  public rowAutoHeight: Boolean = true;
  public currentView: View = 'TimelineWeek';
  public group: GroupModel = {
    enableCompactView: false,
    resources: ['MeetingRoom']
  };
  public allowMultiple: Boolean = true;
  public resourceDataSource: any[] = [
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
      subject: { name: 'Subject', title: 'Cliente', default: '' },
      location: { name: 'Location', title: 'Endereço', default: '' },
      description: { name: 'Description', title: 'Descrição', default: '' },
      startTime: { name: 'StartTime', title: 'Hora Inicio', default: '' },
      endTime: { name: 'EndTime', title: 'Hora Fim', default: '' },
    }
  };

  public instance: Internationalization = new Internationalization();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,    
    private toastr: ToastrService,
    private AtendimentoService: AtendimentoService
  ) { 

  }

  ngOnInit() {
    this.getAtendimentos();    
  }

  onChange(args: ChangeEventArgs): void {
    this.scheduleObj.rowAutoHeight = args.checked;
  }

  getDateHeaderText: Function = (value: Date) => {
    return this.instance.formatDate(value, { skeleton: 'yMEd' });
  };

  onPopupOpen(args: PopupOpenEventArgs): void {

    if (args.type === 'Editor') {

      let data = args.data as any;
      
      let formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
      // Cria a tabela
      let table: HTMLElement = createElement('table',{ className: 'custom-event-editor tempus', attrs: { width: '100%', cellPadding: '5'} });
      // cria a linha 1
      let tr1 : HTMLElement = createElement('tr');
      let td1 : HTMLElement = createElement('td', { className: 'e-textlabel', innerHTML: 'Analista:'});
      let td2 : HTMLElement = createElement('td', { attrs: {colspan: '4'}});
      
      let idAnalista = 0;
      
      if(Array.isArray(data.RoomId)){             
        idAnalista = data.RoomId[0];
      }else{
        idAnalista = data.RoomId;
      }
      let analista = this.getAnalista(idAnalista) as any;

      let inputAnalista : HTMLElement = createElement('input', { className: 'e-input', attrs: { width: '100%', value: analista, readonly: 'readonly'} });

      tr1.appendChild(td1);
      td2.appendChild(inputAnalista);
      tr1.appendChild(td2);
      table.appendChild(tr1);

      // cria a linha 2
      let tr2 : HTMLElement = createElement('tr');
      let td21 : HTMLElement = createElement('td', { className: 'e-textlabel', innerHTML: 'Atendimento:'});
      let td22 : HTMLElement = createElement('td', { attrs: {colspan: '4'}});
      let inputAtendimento : HTMLElement = createElement('input', { attrs: { width: '100%', type: 'text', id: 'comboAtendimento'} });

      tr2.appendChild(td21);
      td22.appendChild(inputAtendimento);
      tr2.appendChild(td22);
      table.appendChild(tr2);

      let comboBoxObject: ComboBox = new ComboBox({
        dataSource: this.atendimentosCombo,
        allowCustom: true,
        fields: { text: 'assunto', value: 'id'},
        placeholder: 'Selecione...'
      });
      comboBoxObject.appendTo(inputAtendimento);

      // cria a linha 3
      let tr3 : HTMLElement = createElement('tr');
      let td31 : HTMLElement = createElement('td', { className: 'e-textlabel', innerHTML: 'Data/Hora:'});
      let td32 : HTMLElement = createElement('td', { attrs: {colspan: '4'}});
      let selDataHora : any = createElement('input', { className: 'e-datetimepicker', attrs: {colspan: '4'}});
      
      td32.appendChild(selDataHora);
      tr3.appendChild(td31);
      tr3.appendChild(td32);
      table.appendChild(tr3);

      let date: Date;

      if(!data.StartTime){ // Se não tem a data, é uma célula em branco sem evento

        let cellDate = parseInt(this.getCellDate(args)); // pega a data da célula
        date = new Date(cellDate);

      }else{
        date = data.StartTime;
      }

      new DateTimePicker({ value: date}, selDataHora);
      
      if(formElement.getElementsByClassName('tempus').length === 0){
        formElement.appendChild(table);
      }

    }else if(args.type === 'QuickInfo')  {
      args.cancel = true;
    }
  }

  getTimeString(value: Date): string {
    return this.instance.formatDate(value, { skeleton: 'Hm' });
  }

  getAnalista(id :number) :string{
    
    let filter = this.resourceDataSource.filter((a) =>{
      if(a.id === id)
        return a;
    });

    return filter[0].text;

  }

  getCellDate(args: any){
    let data = args.target.dataset;
    data = JSON.parse(JSON.stringify(data));
    return data.date;
  }

  getAtendimentos(): void {
    this.AtendimentoService.getAtendimentos().subscribe(
      atendimentos => {
        this.atendimentos = atendimentos;
        this.atendimentosCombo = atendimentos.map(a => {
          return a as any;
        });
        
      },
      error => this.errorMessage = <any>error
    );
  }

  actionBegin(args) :void{
    
    console.log(args.requestType);
    
    if(args.requestType === 'eventCreate'){ // Criar
      alert('clicou salvar incluindo');
    }else if(args.requestType === 'eventChange'){ // Alterar
      alert('clicou salvar alterando');
    }else if(args.requestType === 'eventRemove'){ // Deletar
      alert('clicou deletar');
    }
    
  }

}