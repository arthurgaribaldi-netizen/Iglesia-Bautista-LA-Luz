# 🧪 Estratégia de Implementação Gradual de Testes

## 📋 Visão Geral

Esta estratégia implementa uma abordagem sistemática para resolver problemas de teste, desabilitando todos os testes problemáticos e reativando-os gradualmente, um por vez.

## 🎯 Objetivos

1. **Eliminar falhas de teste** que bloqueiam o desenvolvimento
2. **Implementar testes de forma controlada** e sistemática
3. **Garantir qualidade** através de validação individual
4. **Manter pipeline de CI/CD** funcionando durante o processo

## 🚀 Implementação

### Fase 1: Preparação

```bash
# 1. Criar backup dos testes existentes
npm run test-strategy:backup

# 2. Desabilitar todos os testes problemáticos
npm run test-strategy:disable

# 3. Verificar que não há mais falhas
npm run test:ci
```

### Fase 2: Correção de Infraestrutura

Antes de reativar qualquer teste, corrigir problemas fundamentais:

#### 2.1 Configuração Jest
- ✅ Verificar `jest.config.js`
- ✅ Validar `jest.setup.js`
- ✅ Confirmar mocks do Supabase

#### 2.2 Mocks e Dependências
- ✅ Verificar `__mocks__` directory
- ✅ Validar configuração de ambiente de teste
- ✅ Confirmar dependências de teste

#### 2.3 Configuração de Ambiente
- ✅ Variáveis de ambiente para testes
- ✅ Configuração de banco de dados de teste
- ✅ Configuração de Supabase para testes

### Fase 3: Implementação Gradual

#### Prioridade 1: Testes Utilitários (Mais Simples)
```bash
# Reativar testes básicos primeiro
npm run test-strategy:enable utils/supabase-mock-utils.test.ts
npm run test:ci
# Corrigir problemas específicos se houver
```

#### Prioridade 2: Componentes UI Básicos
```bash
npm run test-strategy:enable components/ui/button.test.tsx
npm run test:ci
# Validar e corrigir
```

#### Prioridade 3: Hooks Simples
```bash
npm run test-strategy:enable hooks/use-breadcrumbs.test.ts
npm run test:ci
# Validar e corrigir
```

#### Prioridade 4: Componentes de Layout
```bash
npm run test-strategy:enable components/layout/header.test.tsx
npm run test-strategy:enable components/layout/footer.test.tsx
npm run test:ci
# Validar e corrigir
```

#### Prioridade 5: Páginas Simples
```bash
npm run test-strategy:enable pages/home.test.tsx
npm run test:ci
# Validar e corrigir
```

#### Prioridade 6: APIs Básicas
```bash
npm run test-strategy:enable api/supabase-simple.test.ts
npm run test-strategy:enable api/church-info.test.ts
npm run test:ci
# Validar e corrigir
```

#### Prioridade 7: APIs Complexas
```bash
npm run test-strategy:enable api/sermons.test.ts
npm run test-strategy:enable api/events.test.ts
npm run test-strategy:enable api/devotionals.test.ts
npm run test:ci
# Validar e corrigir
```

#### Prioridade 8: Testes E2E
```bash
npm run test-strategy:enable e2e/home.spec.ts
npm run test-strategy:enable e2e/navigation.spec.ts
npm run test:e2e
# Validar e corrigir
```

## 🔧 Comandos Úteis

### Listar Testes Disponíveis
```bash
npm run test-strategy:list
```

### Reativar Teste Específico
```bash
npm run test-strategy:enable <nome-do-teste>
```

### Restaurar Todos os Testes (se necessário)
```bash
npm run test-strategy:restore
```

### Executar Testes
```bash
# Testes unitários
npm run test:ci

# Testes E2E
npm run test:e2e

# Todos os testes
npm run test:all
```

## 📊 Monitoramento

### Durante a Implementação
1. **Executar testes após cada reativação**
2. **Corrigir problemas específicos imediatamente**
3. **Documentar soluções encontradas**
4. **Validar pipeline de CI/CD**

### Métricas de Sucesso
- ✅ Todos os testes passam consistentemente
- ✅ Pipeline de CI/CD funciona sem falhas
- ✅ Cobertura de código mantida ou melhorada
- ✅ Tempo de execução dos testes otimizado

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Mocks do Supabase
```typescript
// Verificar se __mocks__/@supabase/supabase-js.ts está correto
// Validar configuração no jest.config.js
```

#### 2. Configuração de Ambiente
```bash
# Verificar variáveis de ambiente para testes
npm run check-env
```

#### 3. Dependências de Teste
```bash
# Verificar se todas as dependências estão instaladas
npm ci
```

#### 4. Configuração Jest
```bash
# Validar configuração Jest
npx jest --showConfig
```

## 📝 Checklist de Validação

Para cada teste reativado:

- [ ] Teste executa sem erros
- [ ] Teste passa consistentemente
- [ ] Não quebra outros testes
- [ ] Cobertura de código adequada
- [ ] Performance aceitável
- [ ] Documentação atualizada

## 🎉 Conclusão

Esta estratégia permite:
- **Controle total** sobre o processo de implementação
- **Identificação precisa** de problemas específicos
- **Correção sistemática** de cada issue
- **Validação contínua** da qualidade
- **Manutenção da estabilidade** do pipeline

Após completar todas as fases, você terá uma suíte de testes robusta e confiável!
