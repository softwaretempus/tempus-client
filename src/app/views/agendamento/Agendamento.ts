import {IUser} from '../user/User';
import {IAtendimento} from '../atendimento/Atendimento';

export interface IAgendamento {
    id: number,
    usuario: IUser,
    dataHoraAgendamento: Date,
    atendimento: IAtendimento
}