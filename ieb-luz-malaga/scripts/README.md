# 🔧 Scripts de Configuração CI/CD

Este diretório contém scripts para configurar e testar o pipeline CI/CD.

## 📋 Scripts Disponíveis

### 1. `setup-github-environments.sh`
Configura os ambientes necessários no GitHub.

**Uso:**
```bash
./scripts/setup-github-environments.sh
```

**O que faz:**
- Cria os ambientes: staging, preview, production, github-pages
- Configura regras de proteção básicas
- Lista os secrets necessários

### 2. `validate-workflows.sh`
Valida todos os workflows GitHub Actions.

**Uso:**
```bash
./scripts/validate-workflows.sh
```

**O que faz:**
- Valida sintaxe YAML dos workflows
- Verifica se os ambientes existem
- Verifica se os secrets estão configurados
- Relata problemas encontrados

### 3. `test-pipeline.sh`
Testa o pipeline completo após as correções.

**Uso:**
```bash
./scripts/test-pipeline.sh
```

**O que faz:**
- Executa workflows de CI, testes e segurança
- Monitora o status dos workflows
- Relata sucessos e falhas

## 🚀 Como Usar

### No Windows (PowerShell)
```powershell
# Executar scripts
bash ./scripts/setup-github-environments.sh
bash ./scripts/validate-workflows.sh
bash ./scripts/test-pipeline.sh
```

### No Linux/macOS
```bash
# Tornar executáveis
chmod +x scripts/*.sh

# Executar scripts
./scripts/setup-github-environments.sh
./scripts/validate-workflows.sh
./scripts/test-pipeline.sh
```

## 📋 Pré-requisitos

1. **GitHub CLI (gh)** instalado e configurado
2. **Autenticação** no GitHub CLI
3. **Permissões** de administrador no repositório

## 🔑 Secrets Necessários

Configure os seguintes secrets no GitHub:

### Vercel
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Notificações
<!-- Slack notifications removed -->

### Segurança
- `SNYK_TOKEN`
- `GITLEAKS_LICENSE`
- `SEMGREP_APP_TOKEN`

### Banco de Dados
- `STAGING_DATABASE_URL`
- `PRODUCTION_DATABASE_URL`

## 🎯 Próximos Passos

1. Execute `setup-github-environments.sh` para configurar ambientes
2. Configure os secrets necessários
3. Execute `validate-workflows.sh` para verificar configuração
4. Execute `test-pipeline.sh` para testar o pipeline
5. Monitore os workflows no GitHub Actions

## 📞 Suporte

Para problemas com os scripts:
1. Verifique se o GitHub CLI está instalado e configurado
2. Verifique se tem permissões de administrador
3. Consulte os logs de erro
4. Entre em contato com a equipe de desenvolvimento
