import {IUser} from '../user/User';
import {IAtendimento} from '../atendimento/Atendimento';

export interface IAgendamento {
    id: number,
    usuario: IUser,
    data_hora_agendamento: Date,
    atendimento: IAtendimento,
    id_atendimento: number
}