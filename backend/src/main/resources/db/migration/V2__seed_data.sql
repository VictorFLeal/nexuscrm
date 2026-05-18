-- Senha de todos os usuários: Admin@123
INSERT INTO users (id, name, email, password, company, role, active) VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'Admin Nexus',
    'admin@nexus.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewFBMHqRILoVR.Wy',
    'Nexus Systems', 'ADMIN', true
),
(
    'a0000000-0000-0000-0000-000000000002',
    'Victor Santos',
    'victor@nexus.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewFBMHqRILoVR.Wy',
    'Nexus Systems', 'USER', true
);

INSERT INTO customers (id, name, email, phone, company, status, user_id) VALUES
('b0000000-0000-0000-0000-000000000001','Empresa Alpha Ltda','contato@alpha.com','(11) 9 8765-4321','Alpha Corp','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000002','Beta Soluções SA','vendas@beta.com.br','(21) 9 7654-3210','Beta SA','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000003','Gamma Tech','suporte@gammatech.io','(31) 9 6543-2109','Gamma Tech','INACTIVE','a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000004','Delta Comércio','delta@comercio.net','(41) 9 5432-1098','Delta ME','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000005','Epsilon Partners','ep@partners.co','(51) 9 4321-0987','Epsilon LLC','LEAD','a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000006','Zeta Distribuidora','zeta@dist.com','(61) 9 3210-9876','Zeta Dist','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000007','Eta Consultoria','eta@consul.com.br','(71) 9 2109-8765','Eta Consul','LEAD','a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000008','Theta Industrial','theta@industrial.br','(81) 9 1098-7654','Theta Ind','INACTIVE','a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000009','Iota Varejo','iota@varejo.shop','(91) 9 0987-6543','Iota Shop','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000010','Kappa Serviços','kappa@servicos.br','(11) 9 9876-5432','Kappa Svc','ACTIVE','a0000000-0000-0000-0000-000000000001');

INSERT INTO products (id, name, sku, description, price, stock, category, status, user_id) VALUES
('d0000000-0000-0000-0000-000000000001','Licença Pro Mensal','NX-PRO-M','Plano Pro com acesso completo',299.90,9999,'Software','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000002','Licença Enterprise Anual','NX-ENT-A','Plano Enterprise com SLA',2999.00,9999,'Software','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000003','Consultoria Setup','NX-CONS-S','Implementação e configuração',1500.00,50,'Serviços','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000004','Treinamento Online','NX-TRAIN','Curso completo de 8h',499.00,200,'Educação','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000005','API Add-on','NX-API','Acesso à API REST',199.00,9999,'Software','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000006','Licença Starter','NX-START','Plano inicial para pequenas equipes',99.90,9999,'Software','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000007','Suporte Premium','NX-SUPP-P','Suporte 24/7 SLA 2h',599.00,100,'Suporte','ACTIVE','a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000008','Relatórios Avançados','NX-REP-A','Módulo de BI integrado',349.00,9999,'Software','INACTIVE','a0000000-0000-0000-0000-000000000001');