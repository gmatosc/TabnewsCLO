# ADR 0001: PostgreSQL local com Docker e Supabase em produção

## Status

Aceito

## Contexto

A issue [#14 — Banco de Dados (Homologação e Produção)](https://github.com/gmatosc/TabnewsCLO/issues/14), aberta em 04/09/2026 no Milestone 1: Fundação, listou ElephantSQL (gratuito, riscado), Neon (gratuito) e DigitalOcean (pago) como candidatos para produção, além do Neon para homologação.

Nos commits `a491b4c` (06/09) e `410ada3` (07/09), o projeto passou a usar PostgreSQL local com `infra/compose.yaml` e `infra/database.js`. O commit `cefc9e0` (08/09) moveu as variáveis locais para `.env.development`. Em `65496b4`, `5ef74c0` e `ec5dddb` (11/09), a conexão foi colocada dentro de `try/catch`, o SSL passou a ser condicional para produção e foi adicionado suporte a certificado CA — ainda sem possuir o certificado. Em `29e3d08` (12/09), foram adicionadas migrations com `node-pg-migrate`. Nesta branch, o nome incorreto `POSTRES_CA` foi corrigido para `POSTGRES_CA`.

Hoje, a aplicação de produção roda na Vercel e usa o banco no Supabase. As credenciais de produção ficam nas variáveis de ambiente da Vercel.

O projeto precisa de PostgreSQL gratuito em produção, acessível pela Vercel e compatível com o código atual: driver `pg`, SQL puro, `node-pg-migrate` e SSL com CA. O desenvolvimento local deve continuar usando Docker, sem alterações.

## Decisão

Manter PostgreSQL local via Docker no desenvolvimento e usar Supabase em produção.

O Supabase não vence em todos os critérios; foi escolhido por oferecer o melhor equilíbrio para as necessidades deste projeto:

- É uma instância PostgreSQL dedicada e padrão. O mesmo código, driver `pg` e migrations funcionam localmente e em produção, sem dependência do fornecedor.
- O banco não desliga entre requisições, evitando cold start de computação — importante para a demonstração e as medições de desempenho.
- Oferece painel com editor SQL e visualização de tabelas, além do pooler Supavisor, útil com as funções serverless da Vercel.
- O plano gratuito inclui 500 MB de banco, 2 projetos ativos e SSL, suficientes para a API de cursos.
- Permite evoluir na mesma plataforma com Auth, Storage e Realtime, se o projeto precisar desses recursos, sem trocar de banco.

## Alternativas consideradas

### Neon

Era o favorito na issue #14. É PostgreSQL serverless, com plano gratuito de 100 CU-horas por projeto por mês, branching de banco e integração com a Vercel. Foi descartado porque o scale-to-zero suspende a computação após 5 minutos sem uso, e a primeira requisição depois da suspensão tem cold start de cerca de 500 ms. Como a API é pequena, acessada de forma esporádica e avaliada por demonstração e números de desempenho, preferi um banco sempre ligado.

O branching do Neon seria uma vantagem para criar bancos por PR. Adotar esse fluxo é algo que eu faria diferente.

### ElephantSQL

Foi riscado na issue #14 porque o serviço foi descontinuado.

### DigitalOcean Managed Databases

É uma opção estável, mas paga; fica fora do orçamento de um projeto de curso.

### MongoDB Atlas

É um banco de documentos. Sua adoção exigiria reescrever `infra/database.js`, as migrations e as consultas SQL, além de abrir mão da modelagem relacional com `CHECK` e UUID usada pela tabela `courses`.

## Consequências

### Positivas

- Há paridade entre o ambiente local (Docker e PostgreSQL 16) e a produção.
- Os segredos ficam somente nas variáveis de ambiente da Vercel e nos GitHub Secrets.
- Uma futura troca de provedor PostgreSQL exige somente alterar variáveis de ambiente.
- A aplicação usa o mesmo driver, SQL e migrations nos ambientes local e de produção.

### Negativas e riscos

- No plano gratuito, o projeto é pausado após 7 dias sem atividade. Durante o período de avaliação, a mitigação é manter acessos periódicos a `/api/v1/status`.
- O banco tem limite de 500 MB.
- O plano gratuito não oferece backups automáticos.
- O endpoint `POST /api/v1/migrations` ainda não tem autenticação.
- Não há branching de banco por PR; esse seria um ganho com o Neon e fica registrado como algo que eu faria diferente.

## Referências

- [Issue #14 — Banco de Dados (Homologação e Produção)](https://github.com/gmatosc/TabnewsCLO/issues/14)
- Commits: `a491b4c`, `410ada3`, `cefc9e0`, `65496b4`, `5ef74c0`, `ec5dddb` e `29e3d08`
- [Preços do Supabase](https://supabase.com/pricing)
- [Planos do Neon](https://neon.com/docs/introduction/plans)
