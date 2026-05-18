# Nexus CRM

Sistema CRM fullstack desenvolvido como teste técnico, com gerenciamento de produtos e clientes.

## 🚀 Tecnologias

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- Axios
- React Router

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- Maven

### Infraestrutura
- Docker
- Docker Compose
- Nginx

---

# 📁 Estrutura do Projeto

```bash
nexuscrm/
│
├── backend/
├── frontend/
├── docker-compose.yml
├── nginx.conf
└── README.md
```

---

# ⚙️ Como Rodar o Projeto

## 1. Clonar o repositório

```bash
git clone https://github.com/VictorFLeal/nexuscrm.git
```

---

## 2. Entrar na pasta

```bash
cd nexuscrm
```

---

# 🐘 Backend

## Entrar na pasta

```bash
cd backend
```

## Rodar aplicação

### Windows

```bash
./mvnw spring-boot:run
```

### Ou pelo IntelliJ
Execute a classe principal do Spring Boot.

---

## Backend disponível em

```bash
http://localhost:8080
```

---

# ⚛️ Frontend

## Entrar na pasta

```bash
cd frontend
```

## Instalar dependências

```bash
npm install
```

## Rodar aplicação

```bash
npm run dev
```

---

## Frontend disponível em

```bash
http://localhost:5173
```

---

# 🐳 Docker

## Subir containers

```bash
docker-compose up -d
```

---

# 🗄️ Banco de Dados

- PostgreSQL
- Flyway migrations
- Seed inicial configurado

---

# ✨ Funcionalidades

## Produtos
- Criar produto
- Editar produto
- Remover produto
- Listar produtos
- Controle de estoque

## Clientes
- Criar cliente
- Editar cliente
- Remover cliente
- Listar clientes

---

# 📌 Observações

- Projeto desenvolvido em arquitetura fullstack monorepo.
- Backend estruturado em camadas:
  - Controller
  - Service
  - Repository
  - DTO
  - Entity

- Frontend componentizado utilizando React + TypeScript.

---

# 👨‍💻 Autor

Victor Leal

- GitHub: https://github.com/VictorFLeal
- LinkedIn: www.linkedin.com/in/victorfleal
