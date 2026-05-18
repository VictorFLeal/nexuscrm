# Nexus — Frontend

Interface SaaS moderna construída com React, Vite e TailwindCSS.

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool + dev server |
| TypeScript | 5 | Tipagem estática |
| TailwindCSS | 3 | Estilização utility-first |
| Framer Motion | 11 | Animações e transitions |
| React Router DOM | 6 | Roteamento client-side |
| React Hook Form | 7 | Formulários performáticos |
| Zod | 3 | Validação de schemas |
| Axios | 1 | HTTP client com interceptors |
| Zustand | 4 | Gerenciamento de estado global |
| Recharts | 2 | Gráficos interativos |
| React Hot Toast | 2 | Notificações toast |
| Lucide React | 0.390 | Ícones SVG |

---

## Estrutura de pastas

```
src/
├── components/
│   ├── charts/          # MetricCard e componentes de gráficos
│   ├── layout/          # Sidebar e Header do AppLayout
│   └── ui/              # Button, Input, Select, Badge, Modal, Skeleton...
│
├── layouts/
│   └── AppLayout.tsx    # Layout principal com sidebar + header
│
├── lib/
│   ├── api.ts           # Instância Axios + interceptors JWT
│   └── utils.ts         # cn(), formatCurrency(), formatDate()...
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── customers/
│   │   └── CustomersPage.tsx
│   ├── landing/
│   │   └── LandingPage.tsx
│   └── products/
│       └── ProductsPage.tsx
│
├── services/
│   └── index.ts         # authService, customerService, productService, dashboardService
│
├── store/
│   └── authStore.ts     # Zustand store (auth + tokens, persisted)
│
├── styles/
│   └── globals.css      # Tailwind + utilitários globais
│
├── types/
│   └── index.ts         # Todas as interfaces TypeScript
│
├── App.tsx              # Router principal + rotas públicas/privadas
├── main.tsx             # Entry point React
└── vite-env.d.ts        # Tipos de env vars
```

---

## Rotas

| Rota | Componente | Acesso |
|---|---|---|
| `/` | LandingPage | Público |
| `/login` | LoginPage | Público (redireciona se logado) |
| `/register` | RegisterPage | Público (redireciona se logado) |
| `/app/dashboard` | DashboardPage | Privado |
| `/app/customers` | CustomersPage | Privado |
| `/app/products` | ProductsPage | Privado |

---

## Executar localmente

### Pré-requisitos
- Node.js 20+
- Backend rodando em `http://localhost:8080/api`

### Desenvolvimento

```bash
# 1. Instalar dependências
npm install

# 2. Criar variável de ambiente
cp .env.example .env
# Editar VITE_API_URL se necessário

# 3. Iniciar dev server
npm run dev
# Acesse http://localhost:5173
```

### Build produção

```bash
npm run build
# Output em /dist
```

### Preview da build

```bash
npm run preview
```

---

## Via Docker

```bash
# Build da imagem
docker build -t nexus-frontend .

# Executar container
docker run -p 3000:80 nexus-frontend
```

---

## Via Docker Compose (stack completa)

Na raiz do projeto:

```bash
docker compose up --build
```

Serviços:
- Frontend → `http://localhost:3000`
- Backend → `http://localhost:8080/api`
- Nginx (proxy) → `http://localhost`
- PostgreSQL → `localhost:5432`

---

## Autenticação

O sistema usa **JWT** com refresh token automático:

- `accessToken` e `refreshToken` são armazenados via **Zustand + localStorage** (persisted)
- O interceptor Axios renova o token automaticamente ao receber `401`
- Logout limpa todo o estado e redireciona para `/login`

### Credenciais de demo (seed do banco):
```
Email: admin@nexus.com
Senha: password
```

---

## Features implementadas

### Landing Page
- Navbar fixa com glassmorphism
- Hero section com mockup animado do dashboard
- Logos de integração
- Grid de 6 features com ícones coloridos
- Seção de métricas com fundo azul
- Integrações em tags
- Tabela de preços (3 planos) com destaque Pro
- 3 depoimentos com estrelas
- FAQ accordion interativo
- CTA final
- Footer completo com 4 colunas

### Auth
- Login com validação Zod + React Hook Form
- Register com confirmação de senha
- Loading states e toasts de feedback
- Redirect automático pós-login

### Dashboard
- Saudação dinâmica (bom dia/boa tarde/boa noite)
- 4 metric cards com animação
- Gráfico de área (receita 6 meses)
- Gráfico de barras (novos clientes)
- Lista de atividade recente

### CRM (Clientes)
- Tabela responsiva com 7 colunas
- Busca em tempo real
- Filtro por status (Ativo / Lead / Inativo)
- Stats rápidos (total, ativos, leads)
- Modal de criação e edição com validação
- Modal de confirmação de exclusão
- Paginação
- Skeleton loading e empty state
- Hover actions (editar/excluir) por linha

### Produtos
- Tabela responsiva com imagem do produto
- SKU em badge monospace
- Indicador de estoque (baixo/esgotado/ok)
- Filtro por status + categoria
- Modal de criação/edição:
  - Preview de imagem por URL
  - Gerador de SKU automático
  - Campo de preço com prefixo R$
- Paginação, skeleton, empty state

---

## Padrões de código

- **Componentes funcionais** com hooks
- **Zod schemas** para validação de formulários
- **useCallback** para otimizar fetches
- **Lazy state resets** com useEffect
- **Rotas privadas/públicas** com guard components
- **Separação clara**: services → store → components → pages
