import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AtendimentoService } from '../atendimento/atendimento.service';
import { IAtendimento } from '../atendimento/Atendimento';
import {IAgendamento } from './Agendamento';
import {IUser} from '../user/User';
import {UserService} from '../user/user.service';
import {AgendamentoService} from './agendamento.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  templateUrl: 'agendamento.component.html',
  styleUrls: ['agendamento.component.css'],
})
export class AgendamentoComponent implements OnInit {
  
  errorMessage: string;
  agendamentoForm: FormGroup;
  
  datas: any[] = [];
  agendamentos: IAgendamento[] = [];
  
  modalService: NgbModal;
  modalOpen: boolean = false;
  dataSelecionada: Date;
  dataSelString: string;
  dataInicial: Date = new Date;

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
              agendamentoService: AgendamentoService,
              private toastr: ToastrService,
              private fb: FormBuilder
  ){
    
    this.modalService = modalService;
    this.atendimentoService = atendimentoService;
    this.userService = userService;
    this.agendamentoService = agendamentoService;

  }

  get tags(): FormArray {
    return <FormArray>this.agendamentoForm.get('tags');
  }

  addTag(): void {
    this.tags.push(new FormControl());
  }

  ngOnInit(){
    this.setDatas();
    this.preparaDados();
    this.agendamentoForm = this.fb.group({
      analistaSelString: [''],
      dataSelString: [''],
      horaSelecionada: ['', [Validators.required]],
      atendimentoSelecionado: ['', [Validators.required]],
    });
    this.atualizaForm();
  }

  setDatas(){
    this.datas = [];
    let range = this.getDatas(this.dataInicial);
    range.forEach(d => {
      this.datas.push({
        data: d,
        dataString: moment(d).format("DD/MM/YYYY")
      })
    });
    
  }

  changeDate(date){
    this.dataInicial = moment(date, 'YYYY-MM-DD').toDate();
    this.setDatas();
    this.atualizaForm();
  }

  onClickCell(data: Date, analista: IUser){
    this.dataSelecionada = data;
    this.dataSelString = moment(data).format('DD/MM/YYYY');
    this.analistaSelecionado = analista;
    this.analistaSelString = analista.nome;
    if(!this.editar){
      this.horaSelecionada = '';
      this.atualizaForm();
    }
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
        this.agendamentos = agendamentos;
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
      let dataAgen = moment(agen.data_hora_agendamento).format('YYYY-MM-DD');
      let dataVer = moment(data).format('YYYY-MM-DD');
      if(agen.usuario.id === analista.id && dataAgen === dataVer){
        filtered.push(agen);
      }  
    });
    return filtered;
  }

  getHoraAgendamento(agendamento: IAgendamento){
    return moment(agendamento.data_hora_agendamento).format('HH:mm');
  }

  onClickAgendamento(agendamento: IAgendamento){
    
    this.editar = true;
    this.dataSelecionada = agendamento.data_hora_agendamento;
    this.dataSelString = moment(agendamento.data_hora_agendamento).format('DD/MM/YYYY');
    this.analistaSelecionado = agendamento.usuario;
    this.analistaSelString = agendamento.usuario.nome;
    this.horaSelecionada = moment(agendamento.data_hora_agendamento).format('HH:mm');
    this.atendimentoSelecionado = agendamento.atendimento;
    this.agendamentoSelecionado = agendamento;
    this.modalOpen = true;
    this.atualizaForm();
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

  selecionado(atendimento: IAtendimento){
    let ret = false;
    if(this.editar){
      if(atendimento.id === this.atendimentoSelecionado.id)
        ret = true;
    }
    return ret;
  }

  atualizaForm(){
    this.agendamentoForm.patchValue({
      analistaSelString: this.analistaSelString,
      dataSelString: this.dataSelString,
      horaSelecionada: this.horaSelecionada,
      atendimentoSelecionado: this.atendimentoSelecionado
    });
  }

  onChangeHora(hora: string){
    this.horaSelecionada = hora;
  }

  getAtendimento(id: number){
    let aten = null;
    this.atendimentos.forEach(a =>{
      if(a.id === id)
        aten = a;
    });
    return aten;
  }

  onChangeAtendimento(id: any){
    id = parseInt(id.split(':')[0]);
    this.atendimentoSelecionado = this.getAtendimento(id);
    console.log(this.atendimentoSelecionado);
  }

  onSave(modal) {
    
    if(!this.editar){ // incluir
    
      let agendamento: any = {};
      agendamento.usuario = this.analistaSelecionado;
      agendamento.data_hora_agendamento = moment(`${this.dataSelString} ${this.horaSelecionada}`, "DD/MM/YYYY HH:mm").toDate();
      agendamento.atendimento = this.atendimentoSelecionado;

      this.agendamentoService.createAgendamento(agendamento)
        .subscribe(async (res) => {
          
          await this.atualizaGrid()
          this.limpa();
          modal.close('Close click');
          this.showSuccess('Agendamento incluído com sucesso');
          
        },
        (error: any) =>  {
          if(error){
            this.showError(error);
          }else{
            this.showError('Algo está errado. Tente mais tarde.')
          }
        } 
      );
    }else{
      
      this.agendamentoSelecionado.usuario = this.analistaSelecionado;
      this.agendamentoSelecionado.data_hora_agendamento = moment(`${this.dataSelString} ${this.horaSelecionada}`, "DD/MM/YYYY HH:mm").toDate();
      this.agendamentoSelecionado.atendimento = this.atendimentoSelecionado;
      this.agendamentoService.updateAgendamento(this.agendamentoSelecionado)
        .subscribe(async (res) => {
            
          await this.atualizaGrid();
          this.limpa();
          modal.close('Close click');
          this.showSuccess('Agendamento alterado com sucesso');
          
        },
        (error: any) =>  {
          if(error){
            this.showError(error);
          }else{
            this.showError('Algo está errado. Tente mais tarde.')
          }
        } 
      );

    }
    
  }

  delete(modal){
    this.agendamentoSelecionado.usuario = this.analistaSelecionado;
    this.agendamentoSelecionado.data_hora_agendamento = moment(`${this.dataSelString} ${this.horaSelecionada}`, "DD/MM/YYYY HH:mm").toDate();
    this.agendamentoSelecionado.atendimento = this.atendimentoSelecionado;
    this.agendamentoService.deleteAgendamento(this.agendamentoSelecionado.id)
      .subscribe(async (res) => {
          
        await this.atualizaGrid();
        this.limpa();
        modal.close('Close click');
        this.showSuccess('Agendamento excluído com sucesso');
        
      },
      (error: any) =>  {
        if(error){
          this.showError(error);
        }else{
          this.showError('Algo está errado. Tente mais tarde.')
        }
      } 
    );
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

  showError(msg) {
    this.toastr.error(msg, 'Erro!');
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Sucesso!');
  }

}