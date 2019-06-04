-- Incluir habilidade
INSERT INTO public."Habilidades" VALUES (1, 'HTML5/CSS3', 'Quinta revisão da linguagem principal da World Wide Web, possui funcionalidades nativas como: location, renderização de elementos cannvas, suporte para arquivos de multimídia, armazenamento de dados na sessão, dentre outras', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (2, 'Bootstrap', 'Framework CSS com sistema de grids responsivo', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (3, 'SASS', 'Pré-processador que permite criar lógicas de programação complexas nas folhas de estilo', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (4, 'Javascript', 'Linguagem leve, interpretada e muito disseminada em aplicações web', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (5, 'Node', 'Permite executar o backend no navegador através do motor do Google Chrome para criar facilmente aplicativos de rede rápidos e escaláveis', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (6, 'Sequelize', 'Framework para desenvolvimento de webapps e apis para aplicações em Node', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (7, 'Angular', 'Framework para desenvolvimento front-end', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (8, 'PostgreSQL', 'Sistema de banco de dados objeto-relacional', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (9, 'GulpJS', 'Ferramenta para automatização e aprimoramento do fluxo de trabalho', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (10, 'Jest', 'Framework de teste Javascript', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (11, 'Balsamiq', 'Wireframe e prototipagem de telas', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');
INSERT INTO public."Habilidades" VALUES (12, 'Photoshop', 'Acabamento e layout dos protótipos', '2019-05-23T19:00:00.000Z', '2019-05-23T19:00:00.000Z');

-- Incluir cliente
INSERT INTO public."Clientes" VALUES (1, 'Totvs', 'Av. Rio Branco, 45 - Sala 905 - 906 - Centro, Rio de Janeiro - RJ, 20090-003', '2139393939', 'contato@totvs.com.br', true, 'TOTVS S.A', '61.366.936/0001-25', 'Maria da Silva', '2019-05-23T20:54:00.000Z', '2019-05-23T20:54:00.000Z');
INSERT INTO public."Clientes" VALUES (2, 'B2W Digital', 'Rua Sacadura Cabral, 102 - Saúde, Rio de Janeiro - RJ, 20081-262', '2139393939', 'contato@b2wdigital.com', true, 'B2W Companhia Digital', '00.776.574/0006-60', 'Maria da Silva', '2019-05-23T20:55:00.000Z', '2019-05-23T20:55:00.000Z');

-- Incluir usuário
INSERT INTO public."Usuarios" VALUES (1, 'Bruno Calixto', 'Del Castilho', '2139393939', 'b.calixto@tempus.com.br', '12345', true, '673.948.210-13', 1, '2019-05-23T20:44:00.000Z', '2019-05-23T20:44:00.000Z', null, 1);
INSERT INTO public."Usuarios" VALUES (2, 'Bruno Sobral', 'Lins de Vasconcelos', '2139393939', 'b.sobral@tempus.com.br', '12345', true, '050.817.290-00', 2, '2019-05-23T20:45:00.000Z', '2019-05-23T20:45:00.000Z');
INSERT INTO public."Usuarios" VALUES (3, 'Fabio Maia', 'S. João', '2139393939', 'f.maia@tempus.com.br', '12345', true, '506.484.220-11', 3, '2019-05-23T20:46:00.000Z', '2019-05-23T20:46:00.000Z',1);
INSERT INTO public."Usuarios" VALUES (4, 'Gilvanleno Mota', 'Tijuca', '2139393939', 'g.mota@tempus.com.br', '12345', true, '032.293.440-06', 4, '2019-05-23T20:47:00.000Z', '2019-05-23T20:47:00.000Z',1);
INSERT INTO public."Usuarios" VALUES (5, 'Juliana de Lira', 'Bangu', '2139393939', 'j.lira@tempus.com.br', '12345', true, '816.887.140-57', 4, '2019-05-23T20:47:00.000Z', '2019-05-23T20:47:00.000Z',2);

-- Incluir atendimento
INSERT INTO public."Atendimentos" VALUES (1, 'Manutenção na Base de Dados', 'Aplicar correção em sistema legado que utiliza SQL Server como solução para base de dados', '2019-06-30T18:00:00.000Z', '2019-05-24T00:22:00.000Z', '2019-05-24T19:00:22.000Z', 4, 1);
INSERT INTO public."Atendimentos" VALUES (2, 'Manutenção no sistema', 'Aplicar correção em sistema legado que utiliza SQL Server como solução para base de dados', '2019-06-30T18:00:00.000Z', '2019-05-24T00:22:00.000Z', '2019-05-24T19:00:22.000Z', 4, 2);
INSERT INTO public."Atendimentos" VALUES (3, 'Desenvolvimento de relatorio', 'Aplicar correção em sistema legado que utiliza SQL Server como solução para base de dados', '2019-06-30T18:00:00.000Z', '2019-05-24T00:22:00.000Z', '2019-05-24T19:00:22.000Z', 5, 3);

-- Incluir projetos
INSERT INTO public."Projetos" VALUES (1, 'Nome do projeto', 'descrição das atividades', '1', '1', '2019-06-04T00:11:00.000Z', '2019-06-04T00:11:00.000Z', 1);