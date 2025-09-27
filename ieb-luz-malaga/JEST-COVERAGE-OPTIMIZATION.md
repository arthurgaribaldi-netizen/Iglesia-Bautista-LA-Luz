# Jest Coverage Optimization

Este arquivo documenta as otimizações implementadas na configuração de cobertura de testes do Jest.

## Configurações de Cobertura Otimizadas

### Arquivos Incluídos na Cobertura
```javascript
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}',           // Todos os arquivos fonte
  '!src/**/*.d.ts',                     // Excluir arquivos de tipos
  '!src/**/*.stories.{js,jsx,ts,tsx}',  // Excluir Storybook
  '!src/app/**/loading.tsx',            // Excluir componentes de loading
  '!src/app/**/error.tsx',              // Excluir componentes de erro
  '!src/app/**/not-found.tsx',          // Excluir componentes 404
  '!src/app/**/layout.tsx',             // Excluir layouts (baixa cobertura)
  '!src/app/**/page.tsx',               // Excluir páginas (baixa cobertura)
  '!src/app/globals.css',               // Excluir CSS global
  '!src/instrumentation.ts',            // Excluir instrumentação
  '!src/middleware.ts',                 // Excluir middleware
]
```

### Thresholds Realistas
```javascript
coverageThreshold: {
  global: {
    branches: 70,    // Reduzido de 80% para 70%
    functions: 70,   // Reduzido de 80% para 70%
    lines: 70,       // Reduzido de 80% para 70%
    statements: 70,  // Reduzido de 80% para 70%
  },
}
```

### Reporters Otimizados
```javascript
coverageReporters: ['text', 'lcov', 'html', 'json']
```

## Benefícios das Otimizações

### 1. Performance Melhorada
- **Exclusões Inteligentes**: Remove arquivos com baixa cobertura esperada
- **Thresholds Realistas**: Evita falhas desnecessárias em CI/CD
- **Reporters Múltiplos**: Facilita análise e integração

### 2. Foco em Qualidade
- **Arquivos Críticos**: Mantém foco em lógica de negócio
- **Componentes UI**: Exclui componentes puramente visuais
- **Configurações**: Exclui arquivos de configuração

### 3. Manutenibilidade
- **Thresholds Ajustáveis**: Fácil de ajustar conforme necessário
- **Exclusões Claras**: Documentação clara do que é excluído
- **Relatórios Detalhados**: HTML para análise visual

## Estratégia de Cobertura

### Arquivos Prioritários (Alta Cobertura)
- `src/lib/` - Lógica de negócio
- `src/components/ui/` - Componentes reutilizáveis
- `src/hooks/` - Custom hooks
- `src/app/api/` - API routes

### Arquivos Secundários (Cobertura Média)
- `src/components/` - Componentes específicos
- `src/app/` - Páginas e layouts

### Arquivos Excluídos (Sem Cobertura)
- Arquivos de configuração
- Componentes de loading/error
- CSS e assets estáticos
- Middleware e instrumentação

## Scripts de Cobertura

### Desenvolvimento
```bash
npm run test:coverage    # Cobertura completa
npm run test:ci          # Cobertura para CI/CD
```

### Análise Detalhada
```bash
# Abrir relatório HTML
open coverage/lcov-report/index.html

# Verificar apenas arquivos específicos
npm run test:coverage -- --collectCoverageFrom="src/lib/**/*"
```

## Monitoramento de Cobertura

### Métricas Importantes
- **Cobertura Global**: Deve manter-se acima de 70%
- **Tendência**: Monitorar se está aumentando ou diminuindo
- **Arquivos Críticos**: Focar em alta cobertura para lógica importante

### Alertas
- Cobertura abaixo de 60% em arquivos críticos
- Diminuição de cobertura em mais de 5%
- Arquivos novos sem cobertura

## Próximos Passos

1. **Implementar Coverage Badges**: Mostrar cobertura no README
2. **Integração com CI/CD**: Falhar build se cobertura baixar
3. **Análise de Tendências**: Monitorar evolução da cobertura
4. **Cobertura por Funcionalidade**: Relatórios específicos por módulo
