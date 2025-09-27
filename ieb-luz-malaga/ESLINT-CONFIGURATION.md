# Configuração ESLint - Iglesia Bautista LA Luz

## Visão Geral

Este projeto utiliza uma configuração ESLint moderna e abrangente que combina múltiplas extensões e plugins para garantir qualidade de código, segurança e acessibilidade.

## Arquivos de Configuração

### `eslint.config.mjs`
Configuração principal do ESLint usando o novo formato flat config (ESLint 8+).

### `.eslintignore`
Arquivo que especifica quais arquivos e diretórios devem ser ignorados pelo ESLint para melhor performance.

### `.eslintrc.json` e `.eslintrc.security.js`
Configurações legadas mantidas para compatibilidade, mas a configuração principal está em `eslint.config.mjs`.

## Extensões e Plugins Utilizados

### Extensões Base
- **next/core-web-vitals**: Regras específicas do Next.js para Core Web Vitals
- **next/typescript**: Suporte completo ao TypeScript no Next.js
- **plugin:security/recommended**: Regras de segurança recomendadas
- **plugin:@typescript-eslint/recommended**: Regras recomendadas do TypeScript ESLint
- **plugin:react-hooks/recommended**: Regras para React Hooks
- **plugin:jsx-a11y/recommended**: Regras de acessibilidade para JSX

### Plugins Adicionais
- **@eslint/eslintrc**: Compatibilidade com configurações legadas
- **@typescript-eslint/eslint-plugin**: Plugin oficial do TypeScript
- **@typescript-eslint/parser**: Parser do TypeScript
- **eslint-plugin-jsx-a11y**: Plugin de acessibilidade
- **eslint-plugin-react**: Plugin do React
- **eslint-plugin-react-hooks**: Plugin para React Hooks
- **eslint-plugin-security**: Plugin de segurança

## Regras Configuradas

### React
- `react/no-danger`: Previne uso de `dangerouslySetInnerHTML`
- `react/jsx-key`: Exige chaves em listas
- `react/no-children-prop`: Previne uso incorreto de `children` como prop
- `react/no-deprecated`: Detecta uso de APIs depreciadas

### TypeScript
- `@typescript-eslint/no-unused-vars`: Detecta variáveis não utilizadas (ignora variáveis com prefixo `_`)
- `@typescript-eslint/no-explicit-any`: Avisa sobre uso de `any`
- `@typescript-eslint/prefer-const`: Força uso de `const` quando possível
- `@typescript-eslint/no-var-requires`: Previne uso de `require()` em arquivos TS

### Segurança
- `security/detect-eval-with-expression`: Detecta uso inseguro de `eval()`
- `security/detect-non-literal-fs-filename`: Detecta caminhos de arquivo não literais
- `security/detect-object-injection`: Detecta injeção de objetos
- `security/detect-unsafe-regex`: Detecta regex inseguros

### Acessibilidade (JSX-A11Y)
- `jsx-a11y/alt-text`: Exige texto alternativo em imagens
- `jsx-a11y/anchor-is-valid`: Valida âncoras
- `jsx-a11y/aria-props`: Valida propriedades ARIA
- `jsx-a11y/html-has-lang`: Exige atributo `lang` no HTML

### Estilo e Formatação
- `prefer-const`: Força uso de `const`
- `no-var`: Previne uso de `var`
- `comma-dangle`: Exige vírgula final em objetos/arrays multilinha
- `semi`: Exige ponto e vírgula
- `object-curly-spacing`: Exige espaços dentro de chaves de objeto

## Configurações Especiais

### Arquivos de Teste
Para arquivos de teste (`*.test.js`, `*.test.ts`, `*.test.tsx`, etc.):
- `security/detect-child-process`: Desabilitado
- `no-console`: Desabilitado
- `@typescript-eslint/no-explicit-any`: Desabilitado
- `jsx-a11y/click-events-have-key-events`: Desabilitado

### Arquivos de Configuração
Para arquivos de configuração (`*.config.js`, `*.config.mjs`, `*.config.ts`):
- `@typescript-eslint/no-var-requires`: Desabilitado
- `no-console`: Desabilitado

## Scripts Disponíveis

### Comandos Básicos
```bash
npm run lint              # Executa linting com Next.js
npm run lint:fix          # Executa linting e corrige problemas automáticos
```

### Comandos Avançados
```bash
npm run lint:check        # Executa ESLint diretamente em todos os arquivos
npm run lint:fix-all      # Corrige todos os problemas automaticamente
npm run lint:report       # Gera relatório JSON dos problemas encontrados
```

### Comandos de Qualidade
```bash
npm run quality:check     # Executa lint, type-check e format:check
npm run quality:fix       # Executa lint:fix e format
```

## Arquivos Ignorados

O ESLint ignora os seguintes tipos de arquivos:
- `node_modules/` e dependências
- Arquivos de build (`.next/`, `out/`, `build/`, `dist/`)
- Arquivos de ambiente (`.env*`)
- Logs e arquivos temporários
- Arquivos gerados (`src/generated/`, `prisma/generated/`)
- Arquivos de teste (`test-results/`, `playwright-report/`)
- Arquivos de configuração do sistema (`.vscode/`, `.idea/`)
- Arquivos de banco de dados (`*.db`, `*.sqlite`)

## Integração com CI/CD

O ESLint está integrado aos workflows do GitHub Actions:
- **CI Pipeline**: Executa linting em cada PR
- **Pre-commit Hooks**: Validação antes do commit
- **Quality Gates**: Bloqueia merge se houver erros críticos

## Configuração do Editor

### VS Code
Recomenda-se instalar as seguintes extensões:
- ESLint
- Prettier - Code formatter
- TypeScript Importer

### Configuração recomendada no VS Code:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Resolução de Problemas

### Erros Comuns

1. **"Cannot find module"**: Execute `npm install` para instalar dependências
2. **"Parsing error"**: Verifique se o arquivo tem extensão correta (.ts/.tsx)
3. **"Rule not found"**: Verifique se o plugin está instalado no package.json

### Desabilitar Regras Especificamente

Para desabilitar uma regra em um arquivo específico:
```javascript
/* eslint-disable security/detect-eval-with-expression */
```

Para desabilitar uma regra em uma linha específica:
```javascript
eval(userInput); // eslint-disable-line security/detect-eval-with-expression
```

## Manutenção

### Atualizações
- Atualize plugins ESLint regularmente
- Revise regras de segurança periodicamente
- Mantenha compatibilidade com versões do Next.js

### Monitoramento
- Use `npm run lint:report` para gerar relatórios
- Monitore métricas de qualidade no CI/CD
- Revise logs de linting regularmente

## Recursos Adicionais

- [Documentação oficial do ESLint](https://eslint.org/)
- [ESLint para Next.js](https://nextjs.org/docs/basic-features/eslint)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [JSX-A11Y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [ESLint Security](https://github.com/eslint-community/eslint-plugin-security)
