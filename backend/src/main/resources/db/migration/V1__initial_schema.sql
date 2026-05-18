CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           VARCHAR(255)  NOT NULL,
    email          VARCHAR(255)  NOT NULL UNIQUE,
    password       VARCHAR(255)  NOT NULL,
    company        VARCHAR(255),
    role           VARCHAR(50)   NOT NULL DEFAULT 'USER',
    active         BOOLEAN       NOT NULL DEFAULT true,
    login_attempts INTEGER       NOT NULL DEFAULT 0,
    locked_until   TIMESTAMP,
    created_at     TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP     NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email  ON users(email);
CREATE INDEX idx_users_active ON users(active);

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token       VARCHAR(500)  NOT NULL UNIQUE,
    user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at  TIMESTAMP     NOT NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_token   ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

CREATE TABLE customers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255)  NOT NULL,
    email       VARCHAR(255),
    phone       VARCHAR(50),
    company     VARCHAR(255),
    status      VARCHAR(50)   NOT NULL DEFAULT 'ACTIVE',
    notes       TEXT,
    user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_customer_status CHECK (status IN ('ACTIVE','INACTIVE','LEAD'))
);
CREATE INDEX idx_customers_user_id    ON customers(user_id);
CREATE INDEX idx_customers_status     ON customers(status);
CREATE INDEX idx_customers_email      ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);

CREATE TABLE products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255)   NOT NULL,
    sku         VARCHAR(100)   NOT NULL,
    description TEXT,
    price       DECIMAL(12,2)  NOT NULL DEFAULT 0 CHECK (price >= 0),
    stock       INTEGER        NOT NULL DEFAULT 0  CHECK (stock >= 0),
    category    VARCHAR(100),
    status      VARCHAR(50)    NOT NULL DEFAULT 'ACTIVE',
    image_url   VARCHAR(1000),
    user_id     UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP      NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_product_sku_user UNIQUE (sku, user_id),
    CONSTRAINT chk_product_status  CHECK  (status IN ('ACTIVE','INACTIVE'))
);
CREATE INDEX idx_products_user_id    ON products(user_id);
CREATE INDEX idx_products_status     ON products(status);
CREATE INDEX idx_products_sku        ON products(sku);
CREATE INDEX idx_products_category   ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID          REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100)  NOT NULL,
    entity      VARCHAR(100),
    entity_id   VARCHAR(255),
    details     TEXT,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(500),
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user_id    ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action     ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
