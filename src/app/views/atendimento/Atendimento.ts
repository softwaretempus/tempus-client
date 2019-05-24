import {IUser} from '../user/User';
import {ISkill} from '../skill/Skill';

export interface IAtendimento {
    id: number,
    usuario: IUser,
    assunto: string,
    descricao: string,
    data_sugerida: Date,
    id_usuario: number,
    id_habilidade: number,
    habilidade: ISkill
}