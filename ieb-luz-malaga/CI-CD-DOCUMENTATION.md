# Documentação CI/CD - IEB Luz Málaga

## Visão Geral

Este projeto implementa um pipeline de CI/CD completo usando GitHub Actions, com foco em qualidade, segurança e deploy automatizado. O sistema está configurado para trabalhar com Vercel como plataforma de deploy.

## Estrutura de Workflows

### 1. Workflow Principal (`ci.yml`)
**Trigger:** Push e Pull Requests nas branches `main` e `develop`

**Jobs:**
- **Lint & Type Check**: Verificação de código e tipos TypeScript
- **Unit Tests**: Testes unitários com cobertura de código
- **E2E Tests**: Testes end-to-end com Playwright
- **Build**: Build da aplicação
- **Security**: Verificação de segurança
- **Deploy Staging**: Deploy automático para staging (branch develop)
- **Deploy Production**: Deploy automático para produção (branch main)

### 2. Workflow de Testes (`tests.yml`)
**Trigger:** Push, PRs e agendamento diário

**Jobs:**
- **Unit Tests & Coverage**: Testes unitários com múltiplas versões do Node.js
- **E2E Tests**: Testes em diferentes navegadores (Chrome, Firefox, Safari)
- **Performance Tests**: Testes de performance com Lighthouse
- **Accessibility Tests**: Testes de acessibilidade
- **Integration Tests**: Testes de integração com banco de dados
- **Visual Regression Tests**: Testes de regressão visual (apenas em PRs)

### 3. Workflow de Segurança (`security.yml`)
**Trigger:** Push, PRs e agendamento diário

**Jobs:**
- **Dependency Audit**: Auditoria de dependências com npm audit
- **Snyk Security Scan**: Verificação de vulnerabilidades com Snyk
- **License Check**: Verificação de licenças das dependências
- **Outdated Dependencies**: Verificação de dependências desatualizadas
- **Secret Scan**: Verificação de secrets no código
- **CodeQL Analysis**: Análise estática de código
- **Security Config**: Verificação de configurações de segurança
- **OWASP Dependency Check**: Verificação OWASP

### 4. Workflow de Preview (`preview.yml`)
**Trigger:** Pull Requests e push na branch develop

**Jobs:**
- **Preview Deploy**: Deploy de preview para PRs
- **Staging Deploy**: Deploy para staging (branch develop)
- **Staging Tests**: Testes de integração em staging
- **Cleanup Previews**: Limpeza de previews antigos
- **Health Check**: Verificação de saúde da aplicação

## Configuração de Secrets

### Secrets Obrigatórios no GitHub

Configure os seguintes secrets no repositório GitHub:

```bash
# Vercel
VERCEL_TOKEN=seu_token_vercel
VERCEL_ORG_ID=seu_org_id_vercel
VERCEL_PROJECT_ID=seu_project_id_vercel

# Banco de Dados
STAGING_DATABASE_URL=postgresql://user:pass@host:port/staging_db
PRODUCTION_DATABASE_URL=postgresql://user:pass@host:port/prod_db

# Notificações
# Slack notifications removed

# Segurança
SNYK_TOKEN=seu_token_snyk

# Supabase (se usando)
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_supabase
```

### Como Configurar os Secrets

1. Acesse o repositório no GitHub
2. Vá em **Settings** > **Secrets and variables** > **Actions**
3. Clique em **New repository secret**
4. Adicione cada secret com o nome e valor correspondente

## Variáveis de Ambiente

### Desenvolvimento
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ieb_luz_malaga"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# YouTube API
YOUTUBE_API_KEY="your-youtube-api-key-here"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key-here"
```

### Produção
Configure as variáveis de ambiente no Vercel:

1. Acesse o dashboard do Vercel
2. Vá no projeto > **Settings** > **Environment Variables**
3. Adicione todas as variáveis necessárias para produção

## Estrutura de Branches

### `main`
- Branch principal de produção
- Deploy automático para produção
- Protegida por regras de PR obrigatório

### `develop`
- Branch de desenvolvimento
- Deploy automático para staging
- Merge automático de feature branches

### Feature Branches
- Nomenclatura: `feature/nome-da-feature`
- Deploy de preview automático
- Requer PR para merge

## Processo de Deploy

### 1. Desenvolvimento
```bash
# Criar feature branch
git checkout -b feature/nova-funcionalidade

# Fazer alterações e commits
git add .
git commit -m "feat: adiciona nova funcionalidade"

# Push para criar PR
git push origin feature/nova-funcionalidade
```

### 2. Pull Request
- Cria automaticamente um preview deploy
- Executa todos os testes
- Verifica segurança e qualidade
- Comenta no PR com o link do preview

### 3. Merge para Develop
- Deploy automático para staging
- Executa testes de integração
- Verifica saúde da aplicação

### 4. Merge para Main
- Deploy automático para produção
- Notifica equipe via sistema interno
- Atualiza documentação

## Monitoramento e Alertas

### Notificações
<!-- Slack notifications removed -->
- Notificações de deploy
- Alertas de falhas nos testes
- Relatórios de segurança

### Canais de Notificação
- `#deployments`: Deploys e status
- `#testing`: Resultados de testes
- `#security`: Alertas de segurança

## Troubleshooting

### Problemas Comuns

#### 1. Falha no Build
```bash
# Verificar logs no GitHub Actions
# Verificar se todas as dependências estão instaladas
npm ci

# Verificar se o Prisma está configurado
npm run db:generate
```

#### 2. Falha nos Testes
```bash
# Executar testes localmente
npm run test:ci

# Executar E2E localmente
npm run test:e2e
```

#### 3. Falha no Deploy
```bash
# Verificar se os secrets estão configurados
# Verificar se o Vercel está configurado corretamente
# Verificar logs no Vercel dashboard
```

### Logs e Debugging

#### GitHub Actions
- Acesse a aba **Actions** no GitHub
- Clique no workflow que falhou
- Verifique os logs de cada job

#### Vercel
- Acesse o dashboard do Vercel
- Vá em **Functions** > **Logs**
- Verifique os logs de build e runtime

## Configurações Avançadas

### Customização de Workflows

#### Adicionar Novos Testes
1. Crie o arquivo de teste
2. Adicione o comando no `package.json`
3. Atualize o workflow correspondente

#### Adicionar Novos Ambientes
1. Configure o ambiente no Vercel
2. Adicione os secrets necessários
3. Crie um novo workflow ou job

### Performance

#### Otimizações Implementadas
- Cache de dependências npm
- Build paralelo de jobs
- Deploy apenas quando necessário
- Limpeza automática de recursos

#### Monitoramento
- Lighthouse CI para performance
- Web Vitals tracking
- Error tracking com Sentry

## Manutenção

### Atualizações Regulares
- Dependabot atualiza dependências automaticamente
- Workflows são atualizados conforme necessário
- Documentação é mantida atualizada

### Backup e Recuperação
- Código versionado no Git
- Configurações em arquivos de workflow
- Secrets gerenciados pelo GitHub

## Suporte

Para dúvidas ou problemas:
1. Verifique esta documentação
2. Consulte os logs do GitHub Actions
3. Verifique o dashboard do Vercel
4. Entre em contato com a equipe de desenvolvimento

---

**Última atualização:** $(date)
**Versão:** 1.0.0
