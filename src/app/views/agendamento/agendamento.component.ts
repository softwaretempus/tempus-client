import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AtendimentoService } from '../atendimento/atendimento.service';
import { IAtendimento } from '../atendimento/Atendimento';
import {IAgendamento } from './Agendamento';
import {IUser} from '../user/User';
import {UserService} from '../user/user.service';
import {AgendamentoService} from './agendamento.service';
import * as moment from 'moment';

@Component({
  templateUrl: 'agendamento.component.html',
  styleUrls: ['agendamento.component.css'],
})
export class AgendamentoComponent implements OnInit {
  datas: any[] = [];
  agendamentos: IAgendamento[] = [];
  
  modalService: NgbModal;
  modalOpen: boolean = false;
  dataSelecionada: Date;
  dataSelString: string;

  analistaSelecionado: IUser;
  analistaSelString: string;

  atendimentoSelecionado: IAtendimento;
  agendamentoSelecionado: IAgendamento;

  horaSelecionada: string = '';

  atendimentoService: AtendimentoService;
  atendimentos: IAtendimento[];
  userService: UserService;
  analistas: IUser[];
  agendamentoService: AgendamentoService;
  gridAgendamento: any = [];

  editar: boolean = false;

  @ViewChild('content')
  content: ElementRef;

  constructor(modalService: NgbModal,
              atendimentoService: AtendimentoService,
              userService: UserService,
              agendamentoService: AgendamentoService
  ){
    
    let range = this.getDatas(new Date);
    range.forEach(d => {
      this.datas.push({
        data: d,
        dataString: moment(d).format("DD/MM/YYYY")
      })
    });
    
    this.modalService = modalService;
    this.atendimentoService = atendimentoService;
    this.userService = userService;
    this.agendamentoService = agendamentoService;

  }

  ngOnInit(){
    this.preparaDados();
  }

  onClickCell(data: Date, analista: IUser){
    this.dataSelecionada = data;
    this.dataSelString = moment(data).format('DD/MM/YYYY');
    this.analistaSelecionado = analista;
    this.analistaSelString = analista.nome;
    
    if(!this.modalOpen){
      this.modalOpen = true;
      const modalRef = this.modalService.open(this.content, 
        { centered: true, 
          backdrop: 'static', 
          keyboard: false,
        }
      );
    }
  }

  getAtendimentos(): void {
    this.atendimentoService.getAtendimentos().subscribe(
      atendimentos => {
        this.atendimentos = atendimentos;
      }
    );
  }

  getAnalistas(): void {
    this.userService.getUsers().subscribe(
      user => {
        let users = user.filter( (u) => u.perfil === 1);
        this.analistas = users;
      }
    );
  }

  getAgendamentos():void{
    this.agendamentoService.getAgendamentos().subscribe(
      agendamentos => {
        let agen = agendamentos as any;
        agen = agen.map((a) =>{
          a.dataHoraAgendamento = a.data_hora_agendamento;
          return a;
        });
        this.agendamentos = agen;
      }
    );
  }

  getNomeCliente(agendamento: IAgendamento): string{
    let nome = '';
    if( agendamento
        && agendamento.atendimento 
        && agendamento.atendimento.usuario){
    
        nome = agendamento.atendimento.usuario.cliente.nome;
          
    }
    return nome;
  }

  getDatas(dataInicial: Date): Date[] {
    
    let temp = new Date(dataInicial);
    let datas: Date[] = [];
    datas.push(new Date(temp));

    for( let i = 0; i < 6; i++){
      temp.setDate(temp.getDate() + 1);
      datas.push(new Date(temp));
    }

    return datas;
    
  }

  getAgendamentosDoDia(analista: IUser, data: Date){
    let filtered: IAgendamento[] = [];
    this.agendamentos.forEach(agen => {
      let dataAgen = moment(agen.dataHoraAgendamento).format('YYYY-MM-DD');
      let dataVer = moment(data).format('YYYY-MM-DD');
      if(agen.usuario.id === analista.id && dataAgen === dataVer){
        filtered.push(agen);
      }  
    });
    return filtered;
  }

  getHoraAgendamento(agendamento: IAgendamento){
    return moment(agendamento.dataHoraAgendamento).format('HH:mm');
  }

  onClickAgendamento(agendamento: IAgendamento){
    
    this.editar = true;
    this.dataSelecionada = agendamento.dataHoraAgendamento;
    this.dataSelString = moment(agendamento.dataHoraAgendamento).format('DD/MM/YYYY');
    this.analistaSelecionado = agendamento.usuario;
    this.analistaSelString = agendamento.usuario.nome;
    this.horaSelecionada = moment(agendamento.dataHoraAgendamento).format('HH:mm');
    this.atendimentoSelecionado = agendamento.atendimento;
    this.agendamentoSelecionado = agendamento;
    this.modalOpen = true;
    const modalRef = this.modalService.open(this.content, 
      { centered: true, 
        backdrop: 'static', 
        keyboard: false,
      }
    );
    
  }

  preparaDados(){
    
    this.getAnalistas();
    this.getAgendamentos();
    this.getAtendimentos();
    
  }

  registraLog(log: any){
    console.log(log);
  }

  atualizaGrid(){
    this.getAgendamentos();
  }

  onSave(modal) {
    
    if(!this.editar){ // incluir
    
      let agendamento: any = {};
      agendamento.usuario = this.analistaSelecionado;
      agendamento.dataHoraAgendamento = moment(`${this.dataSelString} ${this.horaSelecionada}`, "DD/MM/YYYY HH:mm").toDate();
      agendamento.atendimento = this.atendimentoSelecionado;

      this.agendamentoService.createAgendamento(agendamento)
        .subscribe(async (res) => {
          
          await this.atualizaGrid()
          this.limpa();
          modal.close('Close click');
          
        },
        (error: any) =>  alert('Algo está errado. Tente mais tarde.')
      );
    }else{
      
      this.agendamentoSelecionado.usuario = this.analistaSelecionado;
      this.agendamentoSelecionado.dataHoraAgendamento = moment(`${this.dataSelString} ${this.horaSelecionada}`, "DD/MM/YYYY HH:mm").toDate();
      this.agendamentoSelecionado.atendimento = this.atendimentoSelecionado;
      this.agendamentoService.updateAgendamento(this.agendamentoSelecionado)
        .subscribe(async (res) => {
            
          await this.atualizaGrid();
          this.limpa();
          modal.close('Close click');
          
        },
        (error: any) =>  alert('Algo está errado. Tente mais tarde.')
      );

    }
    
  }

  onClose(modal){
    this.limpa();
    modal.close('Close click');
  }

  limpa(){
    this.dataSelecionada = null;
    this.dataSelString = '';
    this.analistaSelecionado = null;
    this.analistaSelString = '';
    this.atendimentoSelecionado = null;
    this.agendamentoSelecionado = null;
    this.modalOpen = false;
    this.editar = false;
  }

}