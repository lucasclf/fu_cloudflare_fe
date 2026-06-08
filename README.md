# FU Web

Frontend da aplicação de catálogo/enciclopédia para Fabula Ultima, construído com React, TypeScript, Vite e Cloudflare. Consome a API do FUDB.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Vitest + Testing Library
- Cloudflare Workers / Wrangler (build estático servido via Worker)

## Requisitos

- Node.js
- npm

## Instalação

```bash
npm install
```

## Configuração

A URL base da API é lida da variável de ambiente `VITE_API_BASE_URL`. Copie o exemplo e ajuste se necessário:

```bash
cp .env.example .env.local
```

```env
VITE_API_BASE_URL=https://api.fu-wiki.cqn.xyz.br
```

## Rodando localmente

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (hot reload) |
| `npm run build` | Checa tipos e gera o build de produção |
| `npm run preview` | Builda e serve o resultado localmente para inspeção |
| `npm run test` | Roda a suíte de testes (Vitest) |
| `npm run test:watch` | Roda os testes em modo watch |
| `npm run typecheck` | Checagem de tipos do código-fonte |
| `npm run test:typecheck` | Checagem de tipos incluindo arquivos de teste |
| `npm run lint` | Lint com ESLint |
| `npm run format` | Formata o projeto com Prettier |
| `npm run format:check` | Verifica formatação sem alterar arquivos |
| `npm run check` | Roda typecheck, lint, formatação e testes em sequência |
| `npm run deploy` | Builda e publica via Wrangler |

## Autenticação

A aplicação possui um fluxo de autenticação completo, integrado ao FUDB:

- **Login** (`/login`) — autentica contra `POST /v1/auth/login`; o backend retorna os dados do usuário no corpo e define um cookie de sessão `HttpOnly`
- **Cadastro** (`/register`) — cria uma conta nova via `POST /v1/auth/register`; sem auto-login — redireciona para o login após o cadastro
- **Logout** — chama `POST /v1/auth/logout` no backend (que instrui o navegador a descartar o cookie) e limpa o estado local
- **Modo visitante** — a opção "Entrar sem login" permite navegar pelo catálogo sem autenticação; nesse modo, um botão "Entrar" ocupa o lugar do menu do usuário e leva de volta à tela de login

### Armazenamento do JWT — cookie HttpOnly

O token JWT **nunca é acessível ao JavaScript**: o backend emite um cookie `HttpOnly; Secure; SameSite=Lax` no login e o navegador o gerencia e envia automaticamente. Mesmo que um script malicioso seja injetado na página (XSS), ele não consegue ler nem exfiltrar o token (`document.cookie` não o exibe).

Todas as chamadas à API usam `credentials: "include"` (`shared/lib/http-client.ts`) para que o navegador inclua o cookie automaticamente — nenhum código de feature precisa anexar headers de autenticação manualmente.

O estado em memória (`features/auth/lib/auth-session-store.ts`) guarda apenas os dados do usuário necessários para a interface (nome, e-mail, etc.), não o token. Como o token fica no cookie do navegador, a sessão **sobrevive a reloads** enquanto o cookie não expirar (30 dias, igual ao JWT).

Os formulários de login e cadastro validam os campos no cliente (obrigatoriedade, formato de e-mail, tamanho mínimo de senha e confirmação de senha reativa) e traduzem erros da API em mensagens amigáveis antes de exibi-las ao usuário.

## Estrutura de Pastas

```
fuweb/
├── src/
│   ├── app/             # Bootstrap: providers, layouts e rotas (React Router)
│   ├── pages/           # Páginas de nível superior (ex.: Home)
│   ├── features/        # Um módulo por domínio (auth, catalog, items, jobs, pcs, ...)
│   │   └── <nome>/
│   │       ├── api/         # Chamadas HTTP ao FUDB
│   │       ├── components/  # Componentes específicos da feature
│   │       ├── config/      # Configuração (filtros, colunas, etc.)
│   │       ├── hooks/       # Hooks específicos da feature
│   │       ├── lib/         # Lógica auxiliar (mappers, validação, stores)
│   │       ├── pages/       # Telas/rotas da feature
│   │       └── types/       # Tipos específicos da feature
│   ├── shared/          # Código compartilhado entre features (componentes, lib, services, ui)
│   ├── assets/          # Imagens estáticas (personagens, itens, profissões)
│   └── worker/          # Entry point do Cloudflare Worker que serve o build
├── .env.example         # Modelo de variáveis de ambiente
└── wrangler.jsonc       # Configuração do Worker
```

## Formatação

Formatar o projeto:

```bash
npm run format
```
