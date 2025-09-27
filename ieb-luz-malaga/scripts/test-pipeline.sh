#!/bin/bash

# 🧪 Script de Teste do Pipeline
# Este script testa o pipeline completo após as correções

set -e

echo "🧪 Testando pipeline CI/CD..."

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

# Testar workflows
echo "🔧 Testando workflows..."

# Listar workflows disponíveis
echo "📋 Workflows disponíveis:"
gh api repos/$REPO/actions/workflows --jq '.workflows[] | "  - \(.name) (\(.state))"'

# Testar workflow de CI
echo ""
echo "🚀 Testando workflow de CI..."
if gh workflow run ci.yml; then
    echo "✅ Workflow de CI iniciado com sucesso"
else
    echo "❌ Falha ao iniciar workflow de CI"
    exit 1
fi

# Aguardar um pouco
echo "⏳ Aguardando 10 segundos..."
sleep 10

# Verificar status do workflow
echo "📊 Status do workflow:"
gh run list --workflow=ci.yml --limit=1

# Testar workflow de testes
echo ""
echo "🧪 Testando workflow de testes..."
if gh workflow run tests.yml; then
    echo "✅ Workflow de testes iniciado com sucesso"
else
    echo "❌ Falha ao iniciar workflow de testes"
    exit 1
fi

# Aguardar um pouco
echo "⏳ Aguardando 10 segundos..."
sleep 10

# Verificar status do workflow
echo "📊 Status do workflow:"
gh run list --workflow=tests.yml --limit=1

# Testar workflow de segurança
echo ""
echo "🔒 Testando workflow de segurança..."
if gh workflow run security-scan.yml; then
    echo "✅ Workflow de segurança iniciado com sucesso"
else
    echo "❌ Falha ao iniciar workflow de segurança"
    exit 1
fi

# Aguardar um pouco
echo "⏳ Aguardando 10 segundos..."
sleep 10

# Verificar status do workflow
echo "📊 Status do workflow:"
gh run list --workflow=security-scan.yml --limit=1

echo ""
echo "✅ Testes do pipeline concluídos!"
echo "📋 Verifique os logs dos workflows no GitHub Actions para mais detalhes"
echo "🔗 https://github.com/$REPO/actions"
