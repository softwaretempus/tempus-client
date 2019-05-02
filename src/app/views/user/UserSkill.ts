import {ISkill} from '../skill/Skill';
import {IUser} from '../user/User';

export interface IUserSkill {
    nivel: number,
    usuario: IUser,
    habilidade: ISkill
}