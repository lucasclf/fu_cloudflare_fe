# Fábula Última Codex (FUWeb)

Frontend de catálogo/enciclopédia e gerenciador de campanhas para o RPG **Fábula Última**, construído em React + TypeScript + Vite e publicado como um Cloudflare Worker. Consome a API do [FUDB](https://github.com/lucasclf) via HTTP.

Produção: **https://fu-wiki.cqn.xyz.br**

## Sobre o projeto

A aplicação tem dois pilares:

1. **Catálogo público** — enciclopédia navegável de itens, classes, magias, poderes, bestiário, NPCs e cenário do sistema Fábula Última, com busca e filtros. Pode ser usado sem login (modo visitante).
2. **Gerenciador de campanhas** — usuários autenticados podem criar campanhas, convidar jogadores, registrar sessões e cadastrar entidades exclusivas da campanha (NPCs, personagens, monstros, itens, locais e facções), que passam a aparecer mescladas ao catálogo global apenas para os membros daquela campanha.

## Funcionalidades

### Catálogo (`/home` e dentro de cada campanha em `/campaigns/:id/entities`)

| Categoria | Conteúdo                                                                                              |
| --------- | ----------------------------------------------------------------------------------------------------- |
| Itens     | Armas, armaduras, escudos, acessórios, artefatos e outros                                             |
| Classes   | Classes/profissões, com seus poderes e proficiências                                                  |
| Magias    | Magias de classe e de monstro, com filtro por origem e por "somente ofensivas"                        |
| Poderes   | Poderes comuns e heroicos, com filtro por classe                                                      |
| Bestiário | Monstros, com filtro por tipo, nível e "somente vilões"                                               |
| NPC's¹    | Personagens não-jogáveis                                                                              |
| PC's¹     | Personagens jogadores, com ficha completa (atributos, classes, poderes, magias, vínculos, inventário) |
| Cenário   | Locais e facções do mundo, com relações entre eles                                                    |

¹ Ocultas no modo visitante (`GUEST_CATEGORIES` em `features/catalog/types/category.ts`) — qualquer usuário autenticado (mesmo sem campanhas) já vê essas categorias no catálogo global.

O catálogo dentro de uma campanha mescla o conteúdo global com o conteúdo exclusivo daquela campanha, mais duas categorias extras: **Sessões** e **Arcanas**.

### Campanhas

- Criar campanha (limite de 5 campanhas como mestre por usuário)
- Painel da campanha: estatísticas (membros, sessões, PCs, NPCs, locais, facções, monstros), lista de membros, convites pendentes e notas do mestre
- Convidar jogadores por nickname/e-mail, aceitar/recusar convite, cancelar convite enviado
- Administração: criar sessões, NPCs, personagens, locais, facções, monstros e itens exclusivos da campanha
- Edição das entidades criadas, a partir do catálogo da campanha
- Upload de imagem própria para NPC, PC, monstro, item, local e facção (ver [Upload de imagens](#upload-de-imagens) abaixo)
- Visão reduzida para jogadores (sem estatísticas administrativas, com acesso ao próprio personagem)

### Autenticação

- Login, cadastro e modo visitante ("Entrar sem login", com acesso só ao catálogo global)
- Sessão via cookie `HttpOnly` (ver seção [Autenticação](#autenticação) abaixo)

## Stack tecnológica

| Camada           | Tecnologia                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| UI               | React 19 + TypeScript                                                                                              |
| Build/dev server | Vite 8                                                                                                             |
| Roteamento       | React Router 7 (rotas com `lazy()` + `Suspense`)                                                                   |
| Estilo           | CSS puro por componente — variáveis globais (`src/index.css`) + CSS Modules para estilos específicos de componente |
| Testes           | Vitest + Testing Library                                                                                           |
| Lint/format      | ESLint (typescript-eslint, react-hooks, react-refresh) + Prettier                                                  |
| Hospedagem       | Cloudflare Workers (`@cloudflare/vite-plugin`), assets estáticos servidos como SPA                                 |
| Build de imagens | `vite-plugin-image-optimizer` (sharp + svgo) — compacta os assets em `src/assets` no build de produção             |

## Pré-requisitos

- Node.js (recomendado a versão mais recente LTS)
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
VITE_API_BASE_URL=https://fudb.cqn-lucas.workers.dev
```

Para apontar para um backend FUDB rodando localmente (`wrangler dev`), use `.env.development.local` (tem prioridade sobre `.env.local` em modo `dev` e já está no `.gitignore`):

```env
VITE_API_BASE_URL=http://localhost:8787
```

> O backend FUDB só libera CORS para origens específicas (ver `cors-middleware.ts` no FUDB). Em desenvolvimento local, isso normalmente significa rodar o front na porta padrão `5173`.

## Rodando localmente

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

## Scripts disponíveis

| Comando                  | Descrição                                                              |
| ------------------------ | ---------------------------------------------------------------------- |
| `npm run dev`            | Inicia o servidor de desenvolvimento (hot reload)                      |
| `npm run build`          | Checa tipos e gera o build de produção (com otimização de imagens)     |
| `npm run preview`        | Builda e serve o resultado localmente para inspeção                    |
| `npm run test`           | Roda a suíte de testes (Vitest)                                        |
| `npm run test:watch`     | Roda os testes em modo watch                                           |
| `npm run typecheck`      | Checagem de tipos do código-fonte                                      |
| `npm run test:typecheck` | Checagem de tipos incluindo arquivos de teste                          |
| `npm run lint`           | Lint com ESLint                                                        |
| `npm run format`         | Formata o projeto com Prettier                                         |
| `npm run format:check`   | Verifica formatação sem alterar arquivos                               |
| `npm run check`          | Roda typecheck, test:typecheck, lint, format:check e test em sequência |
| `npm run deploy`         | Builda e publica via Wrangler                                          |
| `npm run cf-typegen`     | Gera os tipos de bindings do Worker a partir de `wrangler.jsonc`       |

## Rotas da aplicação

| Rota                      | Acesso                   | Descrição                                                 |
| ------------------------- | ------------------------ | --------------------------------------------------------- |
| `/login`                  | Público                  | Autenticação                                              |
| `/register`               | Público                  | Cadastro                                                  |
| `/home`                   | Visitante ou autenticado | Catálogo global                                           |
| `/campaigns`              | Autenticado              | Lista de campanhas (como mestre / como jogador) + criação |
| `/campaigns/:id`          | Membro da campanha       | Painel da campanha                                        |
| `/campaigns/:id/manage`   | Membro da campanha       | Administração (criar entidades)                           |
| `/campaigns/:id/entities` | Membro da campanha       | Catálogo da campanha (global + exclusivo)                 |
| `/invitations`            | Autenticado              | Convites recebidos                                        |

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

## Design system e convenções de estilo

- **Tokens globais** em `src/index.css`: cores (`--color-*`), espaçamento (`--space-*`), raio de borda (`--radius-*`), sombra e transição. Todo componente novo deve usar essas variáveis em vez de cravar cores/medidas fixas.
- **CSS Modules** (`*.module.css`) para estilos específicos de componente que precisam de classes com `:hover`/`:focus-visible`/media queries — é o padrão usado nos cards e painéis de detalhe do catálogo (`features/*/components/*-cards-panel.tsx`, `*-detail-panel.tsx`).
- **CSS simples com BEM-like** (`bloco__elemento--modificador`) para componentes de página/layout mais antigos (ex.: `campaign-card.css`, `app-layout.css`).
- Componentes verdadeiramente genéricos (botão, campo de busca, badge, estado vazio/erro/carregando) vivem em `shared/components/` e devem ser reaproveitados em vez de duplicados.

## Paginação de catálogos longos

Categorias com muitas entidades (bestiário, itens) usam paginação client-side via `shared/hooks/use-paginated-list.ts`: a lista filtrada inteira já está em memória (a busca/filtro continua operando sobre ela), mas só uma página é renderizada por vez, com um botão "Carregar mais" (`shared/components/load-more-button.tsx`). A paginação reseta para a primeira página automaticamente quando o filtro muda.

## Upload de imagens

Entidades de campanha (NPC, PC, monstro, item, local, facção) podem ter uma imagem enviada pelo próprio usuário, em vez de só usar as imagens fixas empacotadas em `src/assets`. O arquivo vai **direto do navegador para o Cloudinary** — nunca passa pelo Worker do FUDB, que só assina a requisição (endpoint `POST /v1/campaigns/:campaignId/uploads/signature`, documentado na seção "Upload de Imagens (Cloudinary)" do README do FUDB).

Fluxo, de dentro para fora:

1. `shared/components/image-upload-field.tsx` — componente de UI genérico (input de arquivo + preview + validação de tipo/tamanho client-side: PNG/JPEG/WebP, até 5MB). Não conhece Cloudinary nem campanhas — recebe um `onUploadFile(file) => Promise<string>` de fora.
2. `features/campaigns/hooks/use-campaign-image-upload.ts` — hook que fornece esse `onUploadFile`: pede a assinatura ao FUDB (`features/campaigns/api/get-upload-signature.ts`) e sobe o arquivo (`shared/lib/upload-to-cloudinary.ts`), retornando a `secure_url`.
3. O formulário guarda essa URL em estado local e a envia como `img_key` no create/update da entidade — substituindo a geração automática de chave (`toSnakeCaseKey`) que existia antes para NPC/Item/Local/Facção, e adicionando o campo do zero para PC/Monstro (que não tinham nenhum tratamento de imagem).
4. Os resolvers de imagem (`features/*/lib/get-*-image-src.ts` e `shared/lib/create-asset-image-resolver.ts`) checam primeiro se o valor parece uma URL (`shared/lib/is-external-image-url.ts`) — se sim, usam direto; senão, caem no comportamento antigo de buscar no `import.meta.glob` dos assets empacotados. Isso mantém o catálogo global (curado, com chaves fixas) funcionando exatamente como antes.

Os 10 formulários que lidam com imagem (criação de NPC/Item/Local/Facção/PC/Monstro em `features/campaigns/components/manage-forms/`, edição de NPC/Item/PC/Monstro e os modais de edição de Local/Facção em `campaign-scenario-catalog-view.tsx`) seguem o mesmo padrão — desabilitam o submit enquanto o upload está em andamento.

## Testes

```bash
npm run test
```

Os testes (`*.test.ts(x)`, Vitest + Testing Library) ficam ao lado do código que testam, principalmente em `features/*/lib/` (mappers, formatters, filtros) e em alguns componentes compartilhados.

## Build e deploy

```bash
npm run build   # tsc -b + vite build (gera dist/client)
npm run deploy  # build + wrangler deploy
```

A aplicação é publicada como um [Cloudflare Worker com assets estáticos](https://developers.cloudflare.com/workers/static-assets/) (`wrangler.jsonc`, `not_found_handling: "single-page-application"`), atendendo o domínio customizado `fu-wiki.cqn.xyz.br`. O entry point do Worker (`src/worker/index.ts`) é intencionalmente vazio — toda a aplicação é estática (SPA); o Worker existe só para servir os assets e aplicar o fallback de SPA.

No build, o plugin `vite-plugin-image-optimizer` compacta as imagens em `src/assets` (PNG com quantização de paleta, JPEG/WebP com `quality: 80`), reduzindo significativamente o tamanho dos assets sem alterar a forma como são importados no código (`import.meta.glob` nos `get-*-image-src.ts` de cada feature).

## Estrutura de pastas

```
fuweb/
├── src/
│   ├── app/             # Bootstrap: providers, layouts e rotas (React Router)
│   ├── pages/           # Páginas de nível superior (ex.: Home)
│   ├── features/        # Um módulo por domínio
│   │   ├── auth/            # Login, cadastro, sessão
│   │   ├── campaigns/       # Campanhas, administração, formulários de criação
│   │   ├── catalog/         # Orquestração do catálogo global (categorias, layout)
│   │   ├── invitations/     # Convites de campanha
│   │   ├── items/jobs/spells/powers/monsters/npcs/pcs/scenario/
│   │   │                  # Um módulo por tipo de entidade do catálogo
│   │   ├── sessions/        # Sessões de campanha
│   │   └── arcanas/         # Arcanas de campanha
│   │   └── <nome>/
│   │       ├── api/         # Chamadas HTTP ao FUDB
│   │       ├── components/  # Componentes específicos da feature
│   │       ├── config/      # Configuração (filtros, colunas, etc.)
│   │       ├── hooks/       # Hooks específicos da feature
│   │       ├── lib/         # Lógica auxiliar (mappers, validação, stores)
│   │       ├── pages/       # Telas/rotas da feature
│   │       └── types/       # Tipos específicos da feature
│   ├── shared/          # Código compartilhado entre features (componentes, hooks, lib, services)
│   ├── assets/          # Imagens estáticas (personagens, itens, classes) — otimizadas no build
│   └── worker/          # Entry point do Cloudflare Worker que serve o build
├── .env.example         # Modelo de variáveis de ambiente
└── wrangler.jsonc       # Configuração do Worker
```

## Formatação

Formatar o projeto:

```bash
npm run format
```
