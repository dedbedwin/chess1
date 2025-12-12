# Chess Coach - Deployment Guide

Este guia explica como fazer deploy do Chess Coach em seu próprio servidor.

## Visão Geral da Arquitetura

Chess Coach é uma aplicação **full-stack** que requer:

- **Frontend**: React 19 + Vite (SPA - Single Page Application)
- **Backend**: Node.js + Express + tRPC
- **Database**: PostgreSQL ou MySQL/TiDB
- **Autenticação**: OAuth 2.0 (Manus ou customizável)

## Requisitos Mínimos

- **Node.js**: v18+ 
- **npm/pnpm**: v8+
- **PostgreSQL**: v12+ (ou MySQL 8+)
- **Git**: para clonar o repositório
- **SSL/HTTPS**: recomendado para produção

## Opção 1: Deploy em Railway (Recomendado para Iniciantes)

Railway é a forma mais simples de fazer deploy sem configurar servidor próprio.

### Passos:

1. **Criar conta em Railway**
   - Acesse https://railway.app
   - Faça login com GitHub

2. **Conectar repositório**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub"
   - Autorize Railway a acessar seu repositório

3. **Configurar variáveis de ambiente**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/chess_coach
   JWT_SECRET=seu_secret_aleatorio_aqui
   VITE_APP_ID=seu_oauth_app_id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   NODE_ENV=production
   ```

4. **Deploy automático**
   - Railway faz deploy automático a cada push para `main`

## Opção 2: Deploy em Render (Alternativa)

Render oferece hospedagem gratuita com limitações.

### Passos:

1. **Criar conta em Render**
   - Acesse https://render.com
   - Faça login com GitHub

2. **Criar Web Service**
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub

3. **Configurar Build e Start**
   ```
   Build Command: npm install && npm run build
   Start Command: npm run start
   ```

4. **Adicionar variáveis de ambiente**
   - Na seção "Environment", adicione todas as variáveis necessárias

## Opção 3: Deploy em VPS Próprio (DigitalOcean, Linode, AWS)

Para controle total, faça deploy em um VPS.

### Pré-requisitos:

- VPS com Ubuntu 22.04 LTS
- SSH acesso ao servidor
- Domínio próprio (opcional mas recomendado)

### Passos:

#### 1. Preparar o Servidor

```bash
# Conectar ao servidor
ssh root@seu_ip_vps

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib

# Instalar Nginx (reverse proxy)
apt install -y nginx

# Instalar Certbot para SSL
apt install -y certbot python3-certbot-nginx
```

#### 2. Configurar PostgreSQL

```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar database
CREATE DATABASE chess_coach;

# Criar usuário
CREATE USER chess_user WITH PASSWORD 'sua_senha_segura';

# Dar permissões
ALTER ROLE chess_user SET client_encoding TO 'utf8';
ALTER ROLE chess_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE chess_user SET default_transaction_deferrable TO on;
ALTER ROLE chess_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE chess_coach TO chess_user;

# Sair
\q
```

#### 3. Clonar e Preparar Aplicação

```bash
# Criar diretório da aplicação
mkdir -p /var/www/chess-coach
cd /var/www/chess-coach

# Clonar repositório
git clone seu_repositorio_url .

# Instalar dependências
npm install

# Criar arquivo .env
cat > .env << EOF
DATABASE_URL=postgresql://chess_user:sua_senha_segura@localhost:5432/chess_coach
JWT_SECRET=$(openssl rand -base64 32)
VITE_APP_ID=seu_oauth_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
NODE_ENV=production
EOF

# Build da aplicação
npm run build
```

#### 4. Configurar PM2 (Process Manager)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Criar arquivo ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'chess-coach',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração para reiniciar após reboot
pm2 startup
pm2 save
```

#### 5. Configurar Nginx como Reverse Proxy

```bash
# Criar arquivo de configuração
cat > /etc/nginx/sites-available/chess-coach << EOF
server {
    listen 80;
    server_name seu_dominio.com www.seu_dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Ativar site
ln -s /etc/nginx/sites-available/chess-coach /etc/nginx/sites-enabled/

# Testar configuração
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

#### 6. Configurar SSL/HTTPS com Let's Encrypt

```bash
# Obter certificado SSL
certbot --nginx -d seu_dominio.com -d www.seu_dominio.com

# Renovação automática
systemctl enable certbot.timer
systemctl start certbot.timer
```

#### 7. Configurar Firewall

```bash
# Ativar UFW
ufw enable

# Permitir SSH
ufw allow 22/tcp

# Permitir HTTP e HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Verificar status
ufw status
```

## Variáveis de Ambiente Necessárias

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=seu_secret_aleatorio_minimo_32_caracteres

# OAuth
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu_owner_id
OWNER_NAME=seu_nome

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_frontend_api_key

# Ambiente
NODE_ENV=production
PORT=3000
```

## Monitoramento e Manutenção

### Ver logs da aplicação
```bash
pm2 logs chess-coach
```

### Reiniciar aplicação
```bash
pm2 restart chess-coach
```

### Atualizar aplicação
```bash
cd /var/www/chess-coach
git pull
npm install
npm run build
pm2 restart chess-coach
```

### Backup do database
```bash
pg_dump -U chess_user chess_coach > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Aplicação não inicia
```bash
# Verificar logs
pm2 logs chess-coach

# Verificar porta 3000
lsof -i :3000

# Verificar database connection
psql -U chess_user -h localhost -d chess_coach -c "SELECT 1;"
```

### Erro de conexão com database
```bash
# Verificar se PostgreSQL está rodando
systemctl status postgresql

# Verificar DATABASE_URL em .env
cat .env | grep DATABASE_URL

# Testar conexão
psql postgresql://chess_user:password@localhost:5432/chess_coach
```

### Certificado SSL expirado
```bash
# Renovar certificado
certbot renew --force-renewal
```

## Performance e Segurança

### Recomendações

1. **Usar HTTPS sempre** - Certbot + Let's Encrypt
2. **Backup regular** - Agendar backups diários do database
3. **Monitorar recursos** - CPU, memória, disco
4. **Atualizar dependências** - `npm audit fix` regularmente
5. **Rate limiting** - Configurar no Nginx para evitar abuse
6. **Logs centralizados** - Considerar usar ELK Stack

### Exemplo de rate limiting no Nginx

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://localhost:3000;
    }
}
```

## Suporte

Para problemas específicos:
- Verificar logs: `pm2 logs chess-coach`
- Consultar documentação: https://docs.railway.app ou https://render.com/docs
- Abrir issue no repositório

## Próximos Passos

1. Escolher plataforma de deploy (Railway recomendado para iniciar)
2. Configurar variáveis de ambiente
3. Fazer deploy
4. Testar funcionalidades
5. Configurar domínio customizado
6. Ativar backups automáticos
