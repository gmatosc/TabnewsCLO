# ADR 0001: Banco de dados PostgreSQL local e Supabase em produção

## Status

Aceito

## Contexto

O projeto precisa de um banco de dados para desenvolvimento local e produção. A configuração local deve ser simples de iniciar e compatível com os testes automatizados. Em produção, o banco precisa estar disponível para a aplicação hospedada na Vercel.

Motivos específicos do projeto para esta escolha: [AJUSTAR]

## Decisão

Usar PostgreSQL local em um container Docker durante o desenvolvimento e os testes. Em produção, usar PostgreSQL hospedado no Supabase.

As credenciais e configurações de produção ficam nas variáveis de ambiente da Vercel; o arquivo local `.env.development` é usado somente no ambiente de desenvolvimento.

## Alternativas consideradas

### Neon

Não escolhido porque: [AJUSTAR: registrar o motivo real para descartar o Neon.]

### MongoDB Atlas

Não escolhido porque: [AJUSTAR: registrar o motivo real para descartar o MongoDB Atlas.]

## Consequências

- O desenvolvimento local pode iniciar o PostgreSQL com Docker e usar a mesma tecnologia de banco de dados da produção.
- A aplicação e as migrações usam PostgreSQL, sem uma camada ORM.
- A configuração local e a de produção são separadas; credenciais de produção são mantidas somente na Vercel.
- O ambiente de produção depende da disponibilidade e da configuração do projeto Supabase.
- [AJUSTAR: adicionar outras consequências relevantes para o projeto.]
