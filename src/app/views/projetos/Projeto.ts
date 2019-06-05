import {IAtendimento} from '../atendimento/Atendimento';
export interface IProjeto {
    id: number
    nome: string
    descricao_atividades: string
    horas_estimadas: number
    horas_realizadas: number
    id_atendimento: number,
    atendimento: IAtendimento
}