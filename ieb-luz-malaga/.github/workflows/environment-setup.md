# 🔧 Configuração de Variáveis de Ambiente e Secrets

Este documento descreve como configurar todas as variáveis de ambiente e secrets necessários para o funcionamento completo do pipeline de CI/CD.

## 📋 Secrets do GitHub

### 🔑 Secrets Obrigatórios

Configure os seguintes secrets no repositório GitHub (Settings > Secrets and variables > Actions):

#### Vercel
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Notificações
```
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

#### Segurança (Opcionais)
```
SNYK_TOKEN=your_snyk_token
SEMGREP_APP_TOKEN=your_semgrep_token
GITLEAKS_LICENSE=your_gitleaks_license
```

#### URLs de Produção
```
PRODUCTION_URL=https://your-domain.com
```

### 🔍 Como Obter os Tokens

#### Vercel Token
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá para Settings > Tokens
3. Crie um novo token com escopo apropriado

#### Vercel Org ID e Project ID
1. No dashboard do Vercel, vá para o projeto
2. Nas configurações do projeto, você encontrará os IDs necessários

#### Slack Webhook URL
1. Crie uma nova app no [Slack API](https://api.slack.com/apps)
2. Configure um Incoming Webhook
3. Copie a URL do webhook

## 🌍 Variáveis de Ambiente de Produção

### Vercel Environment Variables

Configure as seguintes variáveis no dashboard do Vercel:

#### Banco de Dados
```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Autenticação
```
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret
JWT_SECRET=your_jwt_secret
```

#### APIs Externas
```
YOUTUBE_API_KEY=your_youtube_api_key
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

#### Monitoramento
```
VERCEL_ANALYTICS_ID=your_analytics_id
```

### 🔐 Variáveis Sensíveis

⚠️ **IMPORTANTE**: Nunca commite as seguintes variáveis:
- `DATABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `JWT_SECRET`
- `YOUTUBE_API_KEY`
- `SENTRY_DSN`

## 🚀 Configuração por Ambiente

### Desenvolvimento (.env.local)
```bash
# Banco de dados local
DATABASE_URL="postgresql://user:password@localhost:5432/ieb_luz_malaga"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

# Autenticação
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development_secret"
JWT_SECRET="development_jwt_secret"

# APIs
YOUTUBE_API_KEY="your_youtube_key"
```

### Staging
```bash
# Use as mesmas variáveis de produção, mas com URLs de staging
NEXTAUTH_URL="https://staging.your-domain.com"
DATABASE_URL="postgresql://staging_database_url"
```

### Produção
```bash
# Todas as variáveis com valores de produção
NEXTAUTH_URL="https://your-domain.com"
DATABASE_URL="postgresql://production_database_url"
```

## 🔧 Scripts de Configuração

### Verificar Configuração
```bash
npm run check-env
```

### Gerar Secrets
```bash
# Gerar NEXTAUTH_SECRET
openssl rand -base64 32

# Gerar JWT_SECRET
openssl rand -hex 32
```

## 📊 Monitoramento de Secrets

### Verificação Automática
O pipeline inclui verificações automáticas para:
- ✅ Presença de arquivos `.env*` no repositório
- ✅ Uso seguro de `process.env`
- ✅ Detecção de secrets hardcoded

### Alertas de Segurança
- 🔔 Notificações no Slack para falhas de segurança
- 📧 Alertas por email para expiração de tokens
- 🔍 Scan automático de dependências vulneráveis

## 🛡️ Boas Práticas de Segurança

1. **Rotação Regular**: Troque tokens e secrets regularmente
2. **Princípio do Menor Privilégio**: Use tokens com escopo mínimo necessário
3. **Monitoramento**: Monitore o uso de secrets e tokens
4. **Auditoria**: Revise periodicamente as permissões
5. **Backup Seguro**: Mantenha backups seguros das configurações

## 🚨 Troubleshooting

### Erro: "Missing required secrets"
- Verifique se todos os secrets obrigatórios estão configurados
- Confirme se os nomes estão corretos (case-sensitive)

### Erro: "Invalid Vercel token"
- Regenerar o token no Vercel
- Verificar se o token tem as permissões necessárias

### Erro: "Environment variables not found"
- Verificar se as variáveis estão configuradas no Vercel
- Confirmar se os nomes das variáveis estão corretos

## 📞 Suporte

Para problemas com configuração:
1. Verifique os logs do GitHub Actions
2. Consulte a documentação do Vercel
3. Abra uma issue no repositório
