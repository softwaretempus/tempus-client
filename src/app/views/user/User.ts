import {ICustomer} from '../customer/Customer';

export interface IUser {
    id: number
    nome: string
    endereco: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    cep: string
    telefone: string
    email: string
    status: boolean
    cpf: string
    perfil: number
    senha: string
    cliente: ICustomer
    id_cliente: number
    id_coordenador: number
}