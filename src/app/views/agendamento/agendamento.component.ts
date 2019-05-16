import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'agendamento.component.html',
  styleUrls: ['agendamento.component.css']
})
export class AgendamentoComponent {

  title: string = 'Agendamento'
  errorMessage: string;

  columnDefs = [
    {headerName: 'Analistas', field: 'analista', pinned: 'left' },    
    {headerName: '15/05/2019' , field: '20190515', resizable: true },
    {headerName: '16/05/2019', field: '20190516', resizable: true },
    {headerName: '17/05/2019', field: '20190517', resizable: true },
    {headerName: '18/05/2019', field: '20190518', resizable: true },
    {headerName: '19/05/2019', field: '20190519', resizable: true },              
    
  ];

  //cellStyle: {'border-left': '1px solid #b8b8b8'}

  rowData = [
      { analista: 'Bruno Sobral'   , 20190518: 'Embratel'  , 20190515: 'CEG', 20190516: 'Light' },
      { analista: 'Fagner Oliveira', 20190515: 'Petrobras' },
      { analista: 'Bruno Calixto'  , 20190518: 'Coca-Cola' },
      { analista: 'Gilvanleno Mota', 20190515: 'Ambev'     },
      { analista: 'Juliana Lira'   , 20190518: 'Riomix'    },
      { analista: 'Fabio Silva'    , 20190515: 'Light'     },
  ];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,    
    private toastr: ToastrService
  ) { 

  }

}
