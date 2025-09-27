#!/bin/bash

# 🔧 Script de Configuração de Ambientes GitHub
# Este script configura os ambientes necessários no GitHub

set -e

echo "🚀 Configurando ambientes no GitHub..."

# Verificar se gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) não está instalado. Instale primeiro: https://cli.github.com/"
    exit 1
fi

# Verificar se está autenticado
if ! gh auth status &> /dev/null; then
    echo "❌ Não está autenticado no GitHub CLI. Execute: gh auth login"
    exit 1
fi

# Obter informações do repositório
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "📦 Repositório: $REPO"

# Criar ambientes
echo "🔧 Criando ambientes..."

# Ambiente de staging
echo "  - Criando ambiente 'staging'..."
gh api repos/$REPO/environments/staging -X PUT --field protection_rules='[]' || echo "  ⚠️ Ambiente 'staging' já existe"

# Ambiente de preview
echo "  - Criando ambiente 'preview'..."
gh api repos/$REPO/environments/preview -X PUT --field protection_rules='[]' || echo "  ⚠️ Ambiente 'preview' já existe"

# Ambiente de produção
echo "  - Criando ambiente 'production'..."
gh api repos/$REPO/environments/production -X PUT --field protection_rules='[{"type":"required_reviewers","required_reviewers":[{"type":"User","id":1}]}]' || echo "  ⚠️ Ambiente 'production' já existe"

# Ambiente do GitHub Pages
echo "  - Criando ambiente 'github-pages'..."
gh api repos/$REPO/environments/github-pages -X PUT --field protection_rules='[]' || echo "  ⚠️ Ambiente 'github-pages' já existe"

echo "✅ Ambientes configurados com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure os secrets necessários em cada ambiente"
echo "2. Configure as regras de proteção conforme necessário"
echo "3. Teste os workflows"
echo ""
echo "🔑 Secrets necessários:"
echo "  - VERCEL_TOKEN"
echo "  - VERCEL_ORG_ID"
echo "  - VERCEL_PROJECT_ID"
echo "  - SNYK_TOKEN"
echo "  - GITLEAKS_LICENSE"
echo "  - SEMGREP_APP_TOKEN"
echo "  - STAGING_DATABASE_URL"
echo "  - PRODUCTION_DATABASE_URL"
