# Nexus API — Backend

Backend enterprise do Nexus CRM Platform.

## Stack
- Java 21 + Spring Boot 3.3
- Spring Security + JWT (jjwt 0.12.6)
- PostgreSQL 16 + Flyway
- Bucket4j (rate limiting)
- OWASP HTML Sanitizer (XSS protection)
- Lombok + MapStruct
- Docker + Docker Compose

## Credenciais de demo
```
Email: admin@nexus.com
Senha: Admin@123
```

## Executar com Docker (recomendado)

```bash
docker compose up --build
```
API disponível em: http://localhost:8080/api

## Executar localmente

**Pré-requisitos:** Java 21, Maven 3.9+, PostgreSQL 16

```bash
# 1. Criar banco
createdb nexus_db

# 2. Configurar variáveis
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/nexus_db
export SPRING_DATASOURCE_USERNAME=nexus_user
export SPRING_DATASOURCE_PASSWORD=nexus_pass
export JWT_SECRET=nexus-super-secret-jwt-key-2026-must-be-at-least-256-bits-long

# 3. Executar
mvn spring-boot:run
```

## Endpoints principais

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | /api/auth/login | ❌ | Login |
| POST | /api/auth/register | ❌ | Cadastro |
| POST | /api/auth/refresh | ❌ | Renovar token |
| GET | /api/auth/me | ✅ | Perfil do usuário |
| GET | /api/users/me | ✅ | Perfil do usuário |
| PUT | /api/users/me | ✅ | Atualizar perfil |
| PUT | /api/users/me/password | ✅ | Alterar senha |
| GET | /api/customers | ✅ | Listar clientes |
| POST | /api/customers | ✅ | Criar cliente |
| PUT | /api/customers/{id} | ✅ | Editar cliente |
| DELETE | /api/customers/{id} | ✅ | Excluir cliente |
| GET | /api/products | ✅ | Listar produtos |
| POST | /api/products | ✅ | Criar produto |
| PUT | /api/products/{id} | ✅ | Editar produto |
| DELETE | /api/products/{id} | ✅ | Excluir produto |
| GET | /api/dashboard/summary | ✅ | Métricas gerais |
| GET | /api/dashboard/revenue-chart | ✅ | Dados do gráfico |
| GET | /api/dashboard/recent-activity | ✅ | Atividade recente |
| GET | /api/dashboard/top-products | ✅ | Top produtos |
| GET | /api/actuator/health | ❌ | Health check |

## Segurança implementada

- ✅ JWT com access token (24h) + refresh token (7d)
- ✅ BCrypt strength 12
- ✅ Rate limiting por IP (Bucket4j)
- ✅ Brute force protection (bloqueio após 5 tentativas)
- ✅ XSS sanitization (OWASP)
- ✅ Security headers (HSTS, CSP, X-Frame-Options...)
- ✅ CORS configurável por variável de ambiente
- ✅ Audit log assíncrono
- ✅ Limpeza automática de tokens expirados (cron 03:00)
- ✅ Stateless (sem sessão server-side)
- ✅ Validação de input em todos os endpoints
