export interface IUser {
    id: number
    nome: string
    endereco: string
    email: string
    status: boolean
    cpf: string
    perfil: number
    senha: string
    cliente: Object
    id_cliente: number
    id_coordenador: number
}