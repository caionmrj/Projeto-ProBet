Resumo do Projeto: Plataforma de Visualização de Apostas Esportivas
Este projeto foi desenvolvido como parte do desafio para Desenvolvedor Front-End Júnior na ANA Gaming. O objetivo foi criar uma plataforma interativa para visualizar apostas esportivas, utilizando Next.js, TypeScript e a API The Odds API.
O que foi feito:
Estrutura Base: Projeto configurado com Next.js e TypeScript.
Roteamento: Implementadas as rotas principais: Home (/), Esportes (/sports), Ligas por Esporte (/sports/[slug]) e Detalhes da Partida (/match/[id]).
Integração com API: Criado um cliente (OddsAPIClient) para interagir com a The Odds API, buscando esportes, odds por esporte e detalhes de partidas.
Exibição de Dados: As páginas buscam e exibem dados básicos da API (esportes em destaque na home, lista de esportes, jogos por liga, detalhes básicos da partida).
Autenticação: Implementado o fluxo de autenticação OAuth com o GitHub (Desafio Extra), incluindo login
Gerenciamento de Estado: Utilizada a Context API do React para gerenciar o estado de autenticação do usuário.
Estilização: Aplicado Tailwind CSS para a estilização da interface.
Linting: Configurado ESLint para padronização do código.

O que falta fazer / Pontos de Melhoria:
Filtros e Busca: Implementar funcionalidade de filtro e busca na página de Esportes (/sports).
Detalhes Completos das Odds: Garantir que a página de Detalhes da Partida (/match/[id]) exiba todas as odds disponíveis pela API e estatísticas adicionais, se houver.
Funcionalidades da Home: Adicionar/refinar a exibição de "jogos recentes", "melhores odds" e "acesso rápido a favoritos" na Home, se necessário.
Fazer o Logout e confirmação de login para o usuário 
Middleware de Autenticação: Implementar um middleware no Next.js para proteger rotas específicas, permitindo acesso apenas a usuários autenticados (complemento do Desafio Extra).
Testes Automatizados: Adicionar testes unitários ou de integração para os componentes principais (Diferencial).
Otimização de SEO: Aplicar técnicas de SEO para melhorar a indexação (Diferencial).
Refinamento de UI/UX: Aprimorar a interface e a experiência do usuário, possivelmente se baseando nas referências fornecidas no desafio.