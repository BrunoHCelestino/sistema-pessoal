# Sistema Pessoal

Sistema pessoal para gerenciar mensagens recebidas através do formulário de contato do meu [portfólio](https://dev-celestino.vercel.app/), com dashboard de visão geral e caixa de entrada estilo Gmail.

## Visão geral

O projeto é dividido em duas partes:

- **Frontend** — aplicação React (Vite) com autenticação, dashboard e caixa de mensagens.
- **Backend** — futuro servidor de API em Spring Boot (pasta `Backend/`, ainda em desenvolvimento).

## Funcionalidades

- **Dashboard de visão geral** com cards de resumo e últimas mensagens.
- **Caixa de entrada estilo Gmail**:
  - Busca por remetente, assunto ou conteúdo;
  - Marcação de lida / não lida;
  - Ocultar mensagens;
  - Leitura de mensagens em painel lateral;
  - Responder via Gmail (link `mailto:`);
  - Contador de não lidas persistido no navegador.
- **Layout responsivo** com sidebar, perfil e menu de logout.
- **Animações** com Framer Motion e lazy loading das rotas.

## Tecnologias

### Frontend

- React 19
- Vite 6
- React Router 7
- TanStack Query
- Zustand (com persistência)
- Framer Motion
- date-fns
- react-icons

## Estrutura

```
Frontend/
├── public/                 # assets estáticos
└── src/
    ├── api/                # chamadas HTTP (client, auth, messages)
    ├── components/         # componentes por seção (auth, dashboard, layout, messages, ui)
    ├── hooks/              # hooks customizados (useMessages)
    ├── store/              # estado global (auth, inbox)
    └── utils/              # helpers (date, mailto, motion)
```

## Como rodar

### Pré-requisitos

- Node.js 18+
- npm

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Copie o arquivo de exemplo de ambiente e ajuste a URL da API se necessário:

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:8080
```

Scripts disponíveis:

| Script      | Descrição                 |
| ----------- | ------------------------- |
| `npm run dev`     | Servidor de desenvolvimento |
| `npm run build`   | Build de produção (Vite)  |
| `npm run preview` | Pré-visualizar o build    |
| `npm run lint`    | Lint com ESLint           |

## Backend

A pasta `Backend/` está reservada para a API que servirá autenticação e mensagens. O frontend espera os endpoints:

- `POST /auth/login` — autenticação
- `GET /messages?recibo=true` — listagem de mensagens (autenticação Bearer)

## Status

Em desenvolvimento.