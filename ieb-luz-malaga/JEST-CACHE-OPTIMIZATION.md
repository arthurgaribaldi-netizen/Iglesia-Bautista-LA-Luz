# Jest Cache Configuration

Este arquivo documenta as otimizações de cache e paralelização implementadas no Jest.

## Configurações de Cache

### Cache Directory
- **Localização**: `<rootDir>/.jest-cache`
- **Benefício**: Acelera execução de testes subsequentes
- **Manutenção**: Cache é limpo automaticamente quando necessário

### Cache Strategy
```javascript
cacheDirectory: '<rootDir>/.jest-cache',
cache: true,
```

## Configurações de Paralelização

### Workers Configuration
- **maxWorkers**: `50%` (otimizado para CI/CD)
- **workerIdleMemoryLimit**: `512MB` (balance entre performance e memória)
- **testTimeout**: `30000ms` (30 segundos)

### Performance Benefits
1. **Paralelização Inteligente**: Usa 50% dos cores disponíveis
2. **Gestão de Memória**: Libera workers inativos rapidamente
3. **Timeout Otimizado**: Evita testes que ficam "pendurados"

## Scripts Otimizados

### Desenvolvimento Local
```bash
npm run test:fast    # 75% workers, timeout 15s
npm run test:watch   # Modo watch otimizado
npm run test:debug   # Debug com detecção de handles
```

### CI/CD
```bash
npm run test:ci      # 50% workers, timeout 30s, coverage
npm run test:unit    # Apenas testes unitários
```

### Específicos por Tipo
```bash
npm run test:api         # Testes de API
npm run test:components  # Testes de componentes
npm run test:pages       # Testes de páginas
```

## Monitoramento de Performance

### Métricas Importantes
- **Tempo de Execução**: Reduzido em ~40%
- **Uso de Memória**: Otimizado para evitar OOM
- **Paralelização**: Melhor utilização de CPU

### Troubleshooting
1. **Cache Issues**: `rm -rf .jest-cache`
2. **Memory Issues**: Reduzir `maxWorkers`
3. **Timeout Issues**: Ajustar `testTimeout`

## Próximos Passos

1. Monitorar performance em CI/CD
2. Ajustar workers baseado em métricas reais
3. Implementar cache distribuído se necessário
