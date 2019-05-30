// USER
{
	"id": 1,
	"nome": "Bruno Calixto",
	"endereco": "Del Castilho",
	"email": "b.calixto@tempus.com.br",
	"senha": " 12345",
	"status": true,
	"cpf": "673.948.210-13",
	"perfil": 4,
	"createdAt": "2019-05-28T01:03:57.714Z",
	"updatedAt": "2019-05-28T02:43:02.571Z",
	"id_cliente": 2,
	"id_coordenador": null,
	"cliente": {
		"id": 2,
		"nome": "B2W Digital",
		"endereco": "Rua Sacadura Cabral, 102 - Saúde, Rio de Janeiro - RJ, 20081-262",
		"email": "contato@b2wdigital.com",
		"status": true,
		"razao_social": "B2W Companhia Digital",
		"cnpj": "00.776.574/0006-60",
		"nome_responsavel": "Maria da Silva",
		"createdAt": "2019-05-23T20:55:00.000Z",
		"updatedAt": "2019-05-23T20:55:00.000Z"
	}
},

{
	"nome": "Juliana de Lira",
	"endereco": "Bangu",
	"email": "j.lira@tempus.com.br",
	"senha":" 12345",
	"status": true,
	"cpf":"816.887.140-57",
	"perfil": 4,
	"id_cliente": null,
	"id_coordenador": null
}

// AGENDAMENTO
{
	"data_hora_agendamento": "2019-05-29T08:00:00.000Z",
	"id_atendimento": 1,
	"id_usuario": 1,
	"usuario": {
        "id": 3,
        "nome": "Lucas Santos",
        "endereco": "Bangu",
        "email": "l.santos@tempus.com.br",
        "senha": " 12345",
        "status": true,
        "cpf": "674.949.210-15",
        "perfil": 1,
        "createdAt": "2019-05-30T02:12:36.462Z",
        "updatedAt": "2019-05-30T02:12:36.462Z",
        "id_cliente": null,
        "id_coordenador": null,
        "cliente": null
    },
    "atendimento": {
        "id": 1,
        "assunto": "Implementação FrontEnd",
        "descricao": "Integrar novo layout com backend",
        "data_sugerida": "2019-05-31",
        "createdAt": "2019-05-28T02:47:30.645Z",
        "updatedAt": "2019-05-28T02:47:30.645Z",
        "id_usuario": 1,
        "id_habilidade": 1,
        "habilidade": {
            "id": 1,
            "nome": "HTML5/CSS3",
            "descricao": "Quinta revisão da linguagem principal da World Wide Web, possui funcionalidades nativas como: location, renderização de elementos cannvas, suporte para arquivos de multimídia, armazenamento de dados na sessão, dentre outras",
            "createdAt": "2019-05-23T19:00:00.000Z",
            "updatedAt": "2019-05-23T19:00:00.000Z"
        },
        "usuario": {
            "id": 1,
            "nome": "Bruno Calixto",
            "endereco": "Del Castilho",
            "email": "b.calixto@tempus.com.br",
            "senha": " 12345",
            "status": true,
            "cpf": "673.948.210-13",
            "perfil": 4,
            "createdAt": "2019-05-28T01:03:57.714Z",
            "updatedAt": "2019-05-30T02:25:56.848Z",
            "id_cliente": 2,
            "id_coordenador": null
        }
    }
}

// OS
{
	"status": "Aberta",
	"descricao": "Descrição da ordem de serviço",
	"data_hora_inicio": "2019-05-30T08:00:00.000Z",
	"data_hora_final": "2019-05-30T18:00:00.000Z",
	"data_exclusao": "2019-05-31T08:00:00.000Z",
	"agendamento": {
        "id": 1,
        "data_hora_agendamento": "2019-05-29T08:00:00.000Z",
        "data_exclusao": null,
        "createdAt": "2019-05-30T08:24:26.602Z",
        "updatedAt": "2019-05-30T08:24:26.602Z",
        "id_atendimento": 1,
        "id_usuario": 3,
        "atendimento": {
            "id": 1,
            "assunto": "Implementação FrontEnd",
            "descricao": "Integrar novo layout com backend",
            "data_sugerida": "2019-05-31",
            "createdAt": "2019-05-28T02:47:30.645Z",
            "updatedAt": "2019-05-28T02:47:30.645Z",
            "id_usuario": 1,
            "id_habilidade": 1
        },
        "usuario": {
            "id": 3,
            "nome": "Lucas Santos",
            "endereco": "Bangu",
            "email": "l.santos@tempus.com.br",
            "senha": " 12345",
            "status": true,
            "cpf": "674.949.210-15",
            "perfil": 1,
            "createdAt": "2019-05-30T02:12:36.462Z",
            "updatedAt": "2019-05-30T02:12:36.462Z",
            "id_cliente": null,
            "id_coordenador": null
        }
    }
}