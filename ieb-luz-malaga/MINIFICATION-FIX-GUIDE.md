# 🔧 Guia de Correção: Erro de Minificação "tF is not a function"

## 📋 **Problema Identificado**

O erro `TypeError: tF is not a function` é causado por problemas de minificação agressiva durante o processo de build do Next.js. Este erro ocorre quando o Terser (minificador) renomeia funções para nomes curtos como `tF`, `tG`, `tH`, etc., mas algumas referências a essas funções não são atualizadas corretamente.

## ✅ **Soluções Implementadas**

### 1. **Configuração Centralizada de Minificação**
- Criado arquivo `src/lib/minification-config.ts` com configurações otimizadas
- Configurações conservadoras do Terser para preservar nomes de função
- Chunk splitting otimizado para evitar problemas de referência

### 2. **Script de Correção Automática**
- Criado script `scripts/fix-build-minification.js` para limpeza e correção
- Limpeza automática de cache do Next.js e npm
- Regeneração do Prisma Client
- Verificação de configurações

### 3. **Comandos de Build Melhorados**
- `npm run fix:minification` - Executa correção completa
- `npm run build:clean` - Build com limpeza de cache
- `npm run build:force` - Força correção e build

## 🛠️ **Como Resolver o Problema**

### **Opção 1: Correção Automática (Recomendada)**
```bash
cd ieb-luz-malaga
npm run fix:minification
```

### **Opção 2: Limpeza Manual**
```bash
cd ieb-luz-malaga

# 1. Limpar cache do Next.js
rm -rf .next

# 2. Limpar cache do npm
npm cache clean --force

# 3. Regenerar Prisma Client
npx prisma generate

# 4. Executar build
npm run build
```

### **Opção 3: Build com Limpeza**
```bash
cd ieb-luz-malaga
npm run build:clean
```

## 🔍 **Configurações Aplicadas**

### **Terser (Minificador)**
```javascript
terserOptions: {
  keep_fnames: true,        // Preserva nomes de função
  keep_classnames: true,    // Preserva nomes de classe
  mangle: {
    keep_fnames: true,      // Não faz mangling de nomes
    keep_classnames: true,
  },
  compress: {
    drop_console: false,    // Mantém console.log
    drop_debugger: true,    // Remove debugger
    keep_fnames: true,      // Preserva nomes durante compressão
    passes: 1,             // Reduz passes para evitar over-optimization
  }
}
```

### **Chunk Splitting**
```javascript
splitChunks: {
  chunks: 'all',
  minSize: 20000,
  maxSize: 244000,
  cacheGroups: {
    vendor: { /* bibliotecas vendor */ },
    react: { /* React e Next.js */ },
    ui: { /* bibliotecas de UI */ },
    common: { /* chunks comuns */ }
  }
}
```

## 🧪 **Testando a Correção**

### **1. Verificar Build**
```bash
npm run build
```

### **2. Verificar Aplicação**
```bash
npm run start
```

### **3. Testar Funcionalidades**
- Navegação entre páginas
- Componentes dinâmicos
- Formulários
- Integração com banco de dados

## 📊 **Monitoramento**

### **Logs a Verificar**
- Console do browser (F12)
- Logs de build do Next.js
- Logs de produção

### **Sinais de Sucesso**
- ✅ Build executa sem erros
- ✅ Aplicação carrega normalmente
- ✅ Não há erros de função indefinida no console
- ✅ Funcionalidades funcionam corretamente

## 🚨 **Se o Problema Persistir**

### **1. Verificar Dependências**
```bash
npm audit
npm outdated
```

### **2. Verificar Configurações**
```bash
# Verificar se as configurações estão corretas
node -e "console.log(require('./src/lib/minification-config').validateMinificationConfig())"
```

### **3. Debug Detalhado**
```bash
# Build com debug
npm run build -- --debug

# Verificar logs específicos
npm run build 2>&1 | grep -i error
```

### **4. Rollback de Emergência**
Se necessário, pode-se desabilitar minificação completamente:
```javascript
// No next.config.js
config.optimization.minimize = false;
config.optimization.minimizer = [];
```

## 📝 **Arquivos Modificados**

- ✅ `next.config.js` - Configuração centralizada
- ✅ `src/lib/minification-config.ts` - Configurações de minificação
- ✅ `scripts/fix-build-minification.js` - Script de correção
- ✅ `package.json` - Novos comandos de build

## 🎯 **Próximos Passos**

1. **Executar correção**: `npm run fix:minification`
2. **Testar build**: `npm run build`
3. **Verificar aplicação**: `npm run start`
4. **Monitorar produção**: Verificar logs e funcionalidades

## 📞 **Suporte Adicional**

Se o problema persistir após seguir este guia:
- Verificar logs específicos do erro
- Consultar documentação do Next.js sobre minificação
- Considerar atualização de dependências
- Verificar compatibilidade de versões

---

**Status**: ✅ **IMPLEMENTADO**  
**Data**: 2025-01-27  
**Versão**: 1.0  
**Próxima Revisão**: Após testes de produção
