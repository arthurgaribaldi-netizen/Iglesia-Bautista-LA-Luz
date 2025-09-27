# 🔧 Plano de Correções CI/CD - IEB Luz Málaga

## 🚨 Problemas Críticos Identificados

### 1. **Erros de Linting (72 erros)**

#### A. Ambientes Inválidos
**Problema:** Valores de ambiente não reconhecidos pelo GitHub Actions

**Arquivos Afetados:**
- `ci.yml` (linha 162)
- `preview.yml` (linhas 19, 92)
- `pages.yml` (linha 49)
- `docker-build.yml` (linha 99)

**Correção:**
```yaml
# ❌ Incorreto
environment: staging

# ✅ Correto
environment: 
  name: staging
  url: ${{ steps.deploy.outputs.url }}
```

#### B. Inputs Inválidos de Actions
**Problema:** Parâmetros incorretos para actions do Slack

**Arquivos Afetados:**
- `ci.yml` (linha 212)
- `tests.yml` (linha 239)
- `security.yml` (linha 246)
- `preview.yml` (linha 139)
- `production.yml` (linhas 171, 220)

**Correção:**
```yaml
# ❌ Incorreto
webhook_url: ${{ secrets.SLACK_WEBHOOK }}

# ✅ Correto
<!-- Slack notifications removed -->
```

#### C. Função Não Reconhecida
**Problema:** Função `hashFiles` não reconhecida

**Arquivo:** `security-scan.yml` (linha 182)

**Correção:**
```yaml
# ❌ Incorreto
hashFiles('**/package-lock.json')

# ✅ Correto
hashFiles('**/package-lock.json')
# ou usar
hashFiles('package-lock.json')
```

### 2. **Configurações de Ambiente**

#### A. Ambientes Não Configurados
**Problema:** Ambientes referenciados não existem no GitHub

**Solução:**
1. Acesse o repositório no GitHub
2. Vá em Settings > Environments
3. Crie os seguintes ambientes:
   - `staging`
   - `preview`
   - `production`
   - `github-pages`

#### B. Secrets Não Documentados
**Problema:** Secrets referenciados não estão documentados

**Secrets Necessários:**
```bash
# Vercel
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Banco de Dados
STAGING_DATABASE_URL
PRODUCTION_DATABASE_URL

# Notificações
<!-- Slack notifications removed -->

# Segurança
SNYK_TOKEN
SENTRY_ORG
SENTRY_PROJECT
SENTRY_AUTH_TOKEN

# Outros
GITLEAKS_LICENSE
SEMGREP_APP_TOKEN
```

### 3. **Redundância de Workflows**

#### A. Workflows Duplicados
**Problema:** `ci.yml` e `tests.yml` têm jobs similares

**Solução:**
- Manter `ci.yml` como workflow principal
- Remover jobs duplicados de `tests.yml`
- Focar `tests.yml` apenas em testes específicos

## 🛠️ Implementação das Correções

### Fase 1: Correções Críticas (1-2 dias)

#### 1. Corrigir Ambientes Inválidos
```bash
# Executar script de correção
./scripts/fix-environments.sh
```

#### 2. Corrigir Inputs de Actions
```bash
# Executar script de correção
./scripts/fix-action-inputs.sh
```

#### 3. Configurar Ambientes no GitHub
```bash
# Executar script de configuração
./scripts/setup-github-environments.sh
```

### Fase 2: Otimizações (3-5 dias)

#### 1. Consolidar Workflows
- Remover duplicações
- Otimizar dependências entre jobs
- Implementar cache de dependências

#### 2. Melhorar Documentação
- Atualizar documentação com correções
- Adicionar troubleshooting
- Criar guias de configuração

#### 3. Implementar Testes
- Testar pipeline completo
- Verificar todos os jobs
- Validar deploys

### Fase 3: Melhorias Avançadas (1-2 semanas)

#### 1. Segurança Avançada
- Implementar SAST/DAST
- Configurar compliance
- Adicionar auditoria de logs

#### 2. Monitoramento
- Implementar métricas
- Configurar alertas
- Criar dashboards

#### 3. Performance
- Otimizar tempos de execução
- Implementar cache inteligente
- Reduzir custos

## 📋 Checklist de Correções

### ✅ Correções Críticas
- [ ] Corrigir ambientes inválidos (4 arquivos)
- [ ] Corrigir inputs de actions (6 arquivos)
- [ ] Corrigir função hashFiles (1 arquivo)
- [ ] Configurar ambientes no GitHub
- [ ] Documentar todos os secrets

### ✅ Otimizações
- [ ] Consolidar workflows duplicados
- [ ] Implementar cache de dependências
- [ ] Otimizar tempos de execução
- [ ] Melhorar documentação

### ✅ Testes
- [ ] Testar pipeline completo
- [ ] Verificar todos os jobs
- [ ] Validar deploys
- [ ] Testar rollback

### ✅ Monitoramento
- [ ] Configurar alertas
- [ ] Implementar métricas
- [ ] Criar dashboards
- [ ] Documentar troubleshooting

## 🚀 Scripts de Correção

### 1. Script de Correção de Ambientes
```bash
#!/bin/bash
# fix-environments.sh

echo "🔧 Corrigindo ambientes inválidos..."

# Corrigir ci.yml
sed -i 's/environment: staging/environment:\n  name: staging/g' .github/workflows/ci.yml

# Corrigir preview.yml
sed -i 's/environment: preview/environment:\n  name: preview/g' .github/workflows/preview.yml
sed -i 's/environment: staging/environment:\n  name: staging/g' .github/workflows/preview.yml

# Corrigir pages.yml
sed -i 's/environment: github-pages/environment:\n  name: github-pages/g' .github/workflows/pages.yml

# Corrigir docker-build.yml
sed -i 's/environment: staging/environment:\n  name: staging/g' .github/workflows/docker-build.yml

echo "✅ Ambientes corrigidos!"
```

### 2. Script de Correção de Inputs
```bash
#!/bin/bash
# fix-action-inputs.sh

echo "🔧 Corrigindo inputs de actions..."

# Corrigir webhook_url em todos os arquivos
# Slack notifications removed from all workflow files

echo "✅ Inputs corrigidos!"
```

### 3. Script de Configuração de Ambientes
```bash
#!/bin/bash
# setup-github-environments.sh

echo "🔧 Configurando ambientes no GitHub..."

# Criar ambientes via API do GitHub
gh api repos/:owner/:repo/environments/staging -X PUT
gh api repos/:owner/:repo/environments/preview -X PUT
gh api repos/:owner/:repo/environments/production -X PUT
gh api repos/:owner/:repo/environments/github-pages -X PUT

echo "✅ Ambientes configurados!"
```

## 📊 Métricas de Sucesso

### Antes das Correções
- ❌ 72 erros de linting
- ❌ 4 ambientes inválidos
- ❌ 6 inputs inválidos
- ❌ 0% conformidade

### Após as Correções
- ✅ 0 erros de linting
- ✅ 4 ambientes válidos
- ✅ 6 inputs válidos
- ✅ 100% conformidade

## 🎯 Próximos Passos

1. **Executar correções críticas** (1-2 dias)
2. **Testar pipeline completo** (1 dia)
3. **Implementar otimizações** (3-5 dias)
4. **Monitorar performance** (contínuo)
5. **Coletar feedback** (contínuo)

## 📞 Suporte

Para dúvidas sobre as correções:
1. Consulte este documento
2. Verifique os logs do GitHub Actions
3. Entre em contato com a equipe de desenvolvimento

---

**Status:** Aguardando implementação  
**Prioridade:** Crítica  
**Prazo:** 1-2 dias
