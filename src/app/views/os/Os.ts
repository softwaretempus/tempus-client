import { IAgendamento } from '../agendamento/Agendamento';

export interface IOs {
    id: number
    status: string
	descricao: string
	data_hora_inicio: Date
	data_hora_final: Date
	data_exclusao: Date
	agendamento: IAgendamento
}