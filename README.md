Nível B

# TabnewsCLO

API para organizar uma trilha de estudos em cursos. Cada curso tem título,
descrição e status (`planned`, `in_progress` ou `done`), permitindo acompanhar
o que está planejado, em andamento e concluído.

## Stack

- Node.js (versão indicada em `.nvmrc`)
- Next.js 13 com Pages Router e React 18
- PostgreSQL 16
- `pg` para acesso ao banco e `node-pg-migrate` para migrations
- Docker Compose para o PostgreSQL local
- Jest para testes de integração
- Prettier para formatação
- GitHub Actions para CI
- Vercel e Supabase para produção

## Executar localmente

1. Instale as dependências:

   ```bash
   npm ci
   ```

2. Confira se `.env.development` está configurado com as credenciais do
   PostgreSQL local. O arquivo não deve conter credenciais de produção.

3. Inicie o banco local via Docker e o servidor Next.js:

   ```bash
   npm run dev
   ```

4. Em outro terminal, aplique as migrations:

   ```bash
   curl -X POST http://localhost:3000/api/v1/migrations
   ```

   A primeira aplicação retorna `201`; se não houver migrations pendentes,
   retorna `200`.

## Testes e lint

Os testes de integração usam o servidor local. Mantenha `npm run dev` rodando
em um terminal e execute em outro:

```bash
npm test
```

> **Atenção:** os testes de integração limpam o schema `public` antes de
> aplicar as migrations. Use somente o banco local descartável configurado para
> desenvolvimento e testes.

Para verificar a formatação:

```bash
npm run lint:check
```

Para aplicar a formatação:

```bash
npm run lint:fix
```

## Endpoints

| Método   | Endpoint               | Descrição                                                 |
| -------- | ---------------------- | --------------------------------------------------------- |
| `GET`    | `/api/v1/status`       | Estado da API e informações do PostgreSQL                 |
| `GET`    | `/api/v1/migrations`   | Lista migrations pendentes                                |
| `POST`   | `/api/v1/migrations`   | Aplica migrations pendentes                               |
| `GET`    | `/api/v1/courses`      | Lista cursos                                              |
| `POST`   | `/api/v1/courses`      | Cria curso (`title` obrigatório; status padrão `planned`) |
| `GET`    | `/api/v1/courses/{id}` | Consulta curso por UUID                                   |
| `PATCH`  | `/api/v1/courses/{id}` | Atualiza título, descrição e/ou status                    |
| `DELETE` | `/api/v1/courses/{id}` | Remove curso                                              |

Títulos devem conter texto e ter no máximo 120 caracteres. Os status aceitos
são `planned`, `in_progress` e `done`. IDs que não são UUID ou não correspondem
a um curso retornam `404`.

- [Documentação interativa (Swagger UI)](https://tabnews-clone-gray-alpha.vercel.app/docs)
- [Especificação OpenAPI](https://tabnews-clone-gray-alpha.vercel.app/openapi.yaml)

## CI

[![Lint](https://github.com/gmatosc/TabnewsCLO/actions/workflows/lint.yaml/badge.svg)](https://github.com/gmatosc/TabnewsCLO/actions/workflows/lint.yaml)
[![Tests](https://github.com/gmatosc/TabnewsCLO/actions/workflows/tests.yaml/badge.svg)](https://github.com/gmatosc/TabnewsCLO/actions/workflows/tests.yaml)

PR que comprova o bloqueio do CI: [#17](https://github.com/gmatosc/TabnewsCLO/pull/17)

Os workflows executam em pull requests e em pushes para `main`.

## Deploy

Aplicação publicada na Vercel: <https://tabnews-clone-gray-alpha.vercel.app>

O banco de produção fica no Supabase, no plano gratuito, que pausa após 7 dias
sem uso. O workflow Keep Alive chama `/api/v1/status` diariamente para manter o
banco ativo. Ele só roda a partir da `main` e também pode ser disparado
manualmente em Actions > Keep Alive > Run workflow.

## ADR

Decisão sobre o uso de PostgreSQL local via Docker e Supabase em produção:
[ADR 0001 — Banco PostgreSQL local e Supabase](docs/adr/0001-banco-postgres-supabase.md).

## Convenção de commits

Os commits do Projeto Final seguem Conventional Commits em inglês (`feat`,
`fix`, `test`, `docs`, `ci`, `chore`, `style`). Os commits mais antigos da
`main`, anteriores ao Projeto Final, vieram de um estudo anterior e estão em
português, fora desse padrão.

## Desempenho

O cenário k6 alterna requisições `GET` para `/api/v1/status` e
`/api/v1/courses`. Na execução medida:

- p95: **174,28 ms**
- Vazão: **18,77 req/s**
- Falhas HTTP: **0%** (0 de 580 requisições)
- Checks de resposta HTTP 200: **100%** (580 de 580)

Medição feita no **Codespace**, com **20 usuários virtuais por 30 segundos**,
contra o ambiente **local** (`next dev` e PostgreSQL local em Docker). O k6 foi
executado com a imagem `grafana/k6:latest` usando `docker run --network host`.
Os números descrevem essa execução local e podem variar entre ambientes.

O cenário pode ser executado novamente com:

```bash
docker run --rm --network host \
  -v "$PWD/tests/load/courses.k6.js:/scripts/courses.k6.js:ro" \
  grafana/k6 run /scripts/courses.k6.js
```

## Segredos

As credenciais do banco de produção ficam somente nas variáveis de ambiente da
Vercel. O arquivo `.env.development` contém apenas credenciais do banco local e
não deve receber valores de produção.

## Uso de IA

Usei GitHub Copilot para revisão do projeto e geração de código e documentação,
e Dia para planejamento e CI. Todo o código foi revisado por mim.

## O que eu faria diferente

Eu protegeria o `POST /api/v1/migrations` com autenticação. Atualmente, esse
endpoint pode aplicar migrations e não exige autenticação.
