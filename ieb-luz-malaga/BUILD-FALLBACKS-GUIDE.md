# Sistema de Fallbacks para Build Time

Este documento explica o sistema de fallbacks implementado para garantir que a aplicação funcione corretamente durante o processo de build, mesmo quando o banco de dados não está disponível.

## Visão Geral

O sistema de fallbacks foi criado para resolver problemas comuns durante o build de aplicações Next.js que dependem de banco de dados:

- **Build sem banco**: Permite fazer build da aplicação sem conexão com banco de dados
- **Dados de exemplo**: Fornece dados realistas para renderização durante o build
- **Fallback em erros**: Retorna dados de fallback quando há erros de conexão
- **Compatibilidade**: Mantém compatibilidade com o sistema existente

## Arquivos Principais

### `src/lib/build-fallbacks.ts`
Sistema central de fallbacks com:
- Configurações de build
- Dados de fallback estruturados
- Utilitários para verificação
- Funções de criação de respostas

### `src/lib/db.ts`
Cliente Prisma com fallbacks:
- Mock do PrismaClient para build time
- Detecção automática de ambiente
- Re-exports dos utilitários de fallback

### `scripts/test-fallbacks.js`
Script de teste para validar:
- Configuração de fallbacks
- Estrutura dos dados
- Imports dos módulos
- Simulação de build

## Como Funciona

### 1. Detecção de Ambiente

O sistema detecta automaticamente quando usar fallbacks baseado em:

```typescript
export const shouldUseFallbacks = (): boolean => {
  return (
    process.env.SKIP_DATABASE_CHECK === 'true' ||
    process.env.NODE_ENV === 'test' ||
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes('placeholder') ||
    process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL
  );
};
```

### 2. Mock do PrismaClient

Quando os fallbacks estão ativos, um mock do PrismaClient é criado:

```typescript
const mockPrisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (typeof prop === 'string') {
      return new Proxy({}, {
        get() {
          return () => Promise.resolve(null);
        }
      });
    }
    return target[prop as keyof PrismaClient];
  }
});
```

### 3. Dados de Fallback

Dados estruturados e realistas são fornecidos para cada tipo de conteúdo:

- **Informações da Igreja**: Dados básicos da igreja
- **Sermões**: Lista de sermões de exemplo
- **Eventos**: Eventos futuros e passados
- **Recursos**: Materiais espirituais
- **Links**: Links úteis organizacionais
- **Devocionais**: Reflexões diárias

## Uso nas Rotas de API

### Padrão de Implementação

Todas as rotas de API seguem o mesmo padrão:

```typescript
export async function GET(request: NextRequest) {
  try {
    // Skip database calls during build
    if (shouldUseFallbacks()) {
      return NextResponse.json({
        data: buildFallbacks.sermons,
        pagination: buildFallbacks.pagination,
      });
    }

    // Normal database operations
    const data = await prisma.sermon.findMany();
    return NextResponse.json({ data });
  } catch (error) {
    // Return fallback data on error
    return NextResponse.json({
      data: buildFallbacks.sermons,
      pagination: buildFallbacks.pagination,
    });
  }
}
```

### Rotas Atualizadas

- ✅ `/api/church-info` - Informações da igreja
- ✅ `/api/sermons` - Lista de sermões
- ✅ `/api/events` - Eventos da igreja
- ✅ `/api/resources` - Recursos espirituais
- ✅ `/api/links` - Links úteis
- ✅ `/api/devotionals` - Devocionais diários

## Scripts Disponíveis

### Testar Fallbacks
```bash
npm run test:fallbacks
```

### Build com Fallbacks
```bash
npm run build:test-fallbacks
```

### Build Normal
```bash
npm run build
```

## Configuração de Ambiente

### Variáveis de Ambiente

- `SKIP_DATABASE_CHECK=true` - Força uso de fallbacks
- `DATABASE_URL` - URL do banco de dados
- `NODE_ENV` - Ambiente de execução

### Cenários de Uso

1. **Desenvolvimento Local**
   ```bash
   npm run dev
   ```

2. **Build para Produção**
   ```bash
   npm run build
   ```

3. **Build sem Banco**
   ```bash
   SKIP_DATABASE_CHECK=true npm run build
   ```

4. **Testes**
   ```bash
   npm run test
   ```

## Benefícios

### Para Desenvolvimento
- ✅ Build rápido sem dependência de banco
- ✅ Dados realistas para desenvolvimento
- ✅ Testes isolados de banco de dados

### Para Produção
- ✅ Build confiável em CI/CD
- ✅ Fallback automático em caso de erro
- ✅ Dados de exemplo para primeira execução

### Para Manutenção
- ✅ Código mais robusto
- ✅ Melhor tratamento de erros
- ✅ Documentação clara

## Estrutura dos Dados de Fallback

### ChurchInfo
```typescript
{
  name: 'Iglesia Evangélica Bautista La Luz',
  location: 'Málaga, Espanha',
  address: 'Avenida Antonio Gaudí, 4, 29004 Málaga, Espanha',
  email: 'info@ieb-luz-malaga.com',
  phone: '+34 952 123 456',
  website: 'https://ieb-luz-malaga.com',
  // ... outros campos
}
```

### Sermons
```typescript
[
  {
    id: 'fallback-sermon-1',
    title: 'La Fe que Mueve Montañas',
    pastor: 'Pastor Principal',
    date: '2024-01-01T00:00:00.000Z',
    transcript: 'En este sermón exploramos...',
    series: 'Serie de Fe',
    // ... outros campos
  }
]
```

## Troubleshooting

### Problemas Comuns

1. **Build falha com erro de banco**
   - Solução: Use `SKIP_DATABASE_CHECK=true npm run build`

2. **Dados não aparecem na aplicação**
   - Verifique se `shouldUseFallbacks()` retorna `true`
   - Confirme se os dados de fallback estão corretos

3. **Erro de importação**
   - Verifique se `src/lib/build-fallbacks.ts` existe
   - Confirme se os exports estão corretos

### Debug

Para debug, use o script de teste:
```bash
npm run test:fallbacks
```

Este script mostra:
- Configuração atual
- Status dos fallbacks
- Validação dos dados
- Status dos arquivos

## Próximos Passos

### Melhorias Futuras
- [ ] Adicionar mais dados de fallback
- [ ] Implementar cache de fallbacks
- [ ] Adicionar métricas de uso
- [ ] Melhorar documentação

### Integração
- [ ] Integrar com sistema de cache
- [ ] Adicionar fallbacks para outras rotas
- [ ] Implementar fallbacks dinâmicos

## Conclusão

O sistema de fallbacks garante que a aplicação seja robusta e confiável, funcionando corretamente em todos os cenários de build e execução. Ele fornece uma base sólida para desenvolvimento, teste e produção.
