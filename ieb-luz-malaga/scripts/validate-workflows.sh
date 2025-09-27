#!/bin/bash

# 🔍 Script de Validação de Workflows
# Este script valida todos os workflows GitHub Actions

set -e

echo "🔍 Validando workflows GitHub Actions..."

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

# Validar workflows
echo "🔧 Validando workflows..."

WORKFLOWS_DIR=".github/workflows"
ERRORS=0

for workflow in $WORKFLOWS_DIR/*.yml; do
    if [ -f "$workflow" ]; then
        echo "  - Validando $(basename $workflow)..."
        
        # Validar sintaxe YAML
        if ! yq eval '.' "$workflow" > /dev/null 2>&1; then
            echo "    ❌ Erro de sintaxe YAML em $(basename $workflow)"
            ERRORS=$((ERRORS + 1))
        else
            echo "    ✅ Sintaxe YAML válida"
        fi
        
        # Validar com GitHub CLI (se disponível)
        if gh api repos/$REPO/actions/workflows --jq '.workflows[] | select(.name == "'$(basename $workflow)'")' > /dev/null 2>&1; then
            echo "    ✅ Workflow reconhecido pelo GitHub"
        else
            echo "    ⚠️ Workflow não encontrado no GitHub (pode ser novo)"
        fi
    fi
done

# Verificar ambientes
echo "🔧 Verificando ambientes..."

ENVIRONMENTS=("staging" "preview" "production" "github-pages")

for env in "${ENVIRONMENTS[@]}"; do
    if gh api repos/$REPO/environments/$env > /dev/null 2>&1; then
        echo "  ✅ Ambiente '$env' existe"
    else
        echo "  ❌ Ambiente '$env' não encontrado"
        ERRORS=$((ERRORS + 1))
    fi
done

# Verificar secrets
echo "🔧 Verificando secrets..."

SECRETS=("VERCEL_TOKEN" "VERCEL_ORG_ID" "VERCEL_PROJECT_ID")

for secret in "${SECRETS[@]}"; do
    if gh api repos/$REPO/actions/secrets --jq '.secrets[] | select(.name == "'$secret'")' > /dev/null 2>&1; then
        echo "  ✅ Secret '$secret' configurado"
    else
        echo "  ❌ Secret '$secret' não encontrado"
        ERRORS=$((ERRORS + 1))
    fi
done

# Resultado final
echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ Todos os workflows estão válidos!"
    echo "🚀 Pronto para usar em produção!"
else
    echo "❌ Encontrados $ERRORS problemas que precisam ser corrigidos"
    echo "🔧 Execute os scripts de correção antes de prosseguir"
    exit 1
fi
