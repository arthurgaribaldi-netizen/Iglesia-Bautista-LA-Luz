# 🤖 AI Agent Prompt - Implementação de Melhorias Técnicas
## Site IEB La Luz Málaga - Fase 1: Fundação Técnica

### 📋 **CONTEXTO DO PROJETO**

Você é um agente AI especializado em desenvolvimento web moderno, responsável por implementar melhorias técnicas críticas no site da Igreja Evangélica Bautista La Luz Málaga. O projeto já possui uma base técnica sólida com Next.js 14, TypeScript, Tailwind CSS e Supabase, mas precisa de implementações essenciais para atingir padrões de produção enterprise.

**URL do Site**: https://ieblaluzmalaga.vercel.app/
**Repositório**: [GitHub - ieb-luz-malaga]
**Tecnologias Atuais**: Next.js 14, TypeScript, React 18, Tailwind CSS, Supabase, Prisma

### 🎯 **OBJETIVO PRINCIPAL**

Implementar as **3 melhorias técnicas de ALTA PRIORIDADE** identificadas na auditoria:

1. **Framework de Testes Automatizados** (Jest + Testing Library + Playwright)
2. **Sistema de Monitoramento Avançado** (Sentry + Analytics + Core Web Vitals)
3. **Sistema de Cache Avançado** (Redis + Vercel Edge Cache)

### 📁 **ESTRUTURA DO PROJETO ATUAL**

```
ieb-luz-malaga/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Componentes React
│   ├── lib/                # Utilitários e configurações
│   └── types/              # Definições TypeScript
├── public/                 # Assets estáticos
├── prisma/                 # Schema do banco de dados
├── scripts/                # Scripts de automação
└── package.json            # Dependências
```

### 🔧 **TAREFAS ESPECÍFICAS - FASE 1**

#### **TAREFA 1: Framework de Testes Automatizados**

**Objetivo**: Implementar cobertura completa de testes para garantir qualidade e confiabilidade.

**Implementações Necessárias**:

1. **Configuração Jest + Testing Library**
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
   ```

2. **Configuração Playwright para E2E**
   ```bash
   npm install --save-dev @playwright/test
   npx playwright install
   ```

3. **Estrutura de Testes**:
   ```
   __tests__/
   ├── components/           # Testes de componentes
   ├── pages/               # Testes de páginas
   ├── api/                 # Testes de APIs
   ├── e2e/                 # Testes end-to-end
   └── utils/               # Testes de utilitários
   ```

4. **Testes Prioritários**:
   - Componentes UI críticos (Header, Footer, YouTubePlayer)
   - Páginas principais (Home, Eventos, Sermões)
   - APIs (YouTube, Contato, Eventos)
   - Fluxos de usuário completos (E2E)

5. **Configuração CI/CD**:
   - GitHub Actions para testes automáticos
   - Coverage reports
   - Test results em PRs

#### **TAREFA 2: Sistema de Monitoramento Avançado**

**Objetivo**: Implementar monitoramento completo para performance, erros e analytics.

**Implementações Necessárias**:

1. **Sentry para Error Tracking**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Google Analytics 4 + Core Web Vitals**
   ```bash
   npm install @vercel/analytics
   ```

3. **Performance Monitoring**:
   - Core Web Vitals tracking
   - Real User Monitoring (RUM)
   - Custom metrics para igreja

4. **Dashboard de Monitoramento**:
   - Página `/admin/monitoring`
   - Métricas em tempo real
   - Alertas automáticos

5. **Logging Estruturado**:
   - Winston para logging
   - Log levels configuráveis
   - Log aggregation

#### **TAREFA 3: Sistema de Cache Avançado**

**Objetivo**: Implementar cache inteligente para melhorar performance e reduzir custos.

**Implementações Necessárias**:

1. **Redis Cache Layer**
   ```bash
   npm install redis ioredis
   ```

2. **Vercel Edge Cache**:
   - Configuração de edge functions
   - Cache de APIs
   - Cache de páginas estáticas

3. **Cache Strategies**:
   - Cache First: Recursos estáticos
   - Network First: APIs dinâmicas
   - Stale While Revalidate: Conteúdo semi-estático

4. **Cache Invalidation**:
   - TTL configurável
   - Invalidação por tags
   - Cache warming

### 📋 **REQUISITOS TÉCNICOS ESPECÍFICOS**

#### **Qualidade de Código**
- **TypeScript**: Tipagem estrita, sem `any`
- **ESLint**: Configuração rigorosa com regras de acessibilidade
- **Prettier**: Formatação consistente
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Padrão de commits

#### **Performance**
- **Lighthouse Score**: >90 em todas as métricas
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Bundle Size**: <500KB gzipped
- **Cache Hit Rate**: >80%

#### **Acessibilidade**
- **WCAG 2.1 AA**: Conformidade completa
- **Screen Reader**: Testado com NVDA/JAWS
- **Keyboard Navigation**: 100% navegável por teclado
- **Color Contrast**: Mínimo 4.5:1

#### **Segurança**
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Rate Limiting**: Proteção contra abuse
- **Input Validation**: Sanitização de dados
- **Dependency Scanning**: Vulnerabilidades atualizadas

### 🚀 **CRONOGRAMA DE IMPLEMENTAÇÃO**

#### **Semana 1: Testes**
- Dia 1-2: Configuração Jest + Testing Library
- Dia 3-4: Testes de componentes críticos
- Dia 5-7: Configuração Playwright + testes E2E

#### **Semana 2: Monitoramento**
- Dia 1-2: Configuração Sentry
- Dia 3-4: Google Analytics 4 + Core Web Vitals
- Dia 5-7: Dashboard de monitoramento

#### **Semana 3: Cache**
- Dia 1-2: Configuração Redis
- Dia 3-4: Vercel Edge Cache
- Dia 5-7: Otimização e testes de performance

### 📊 **MÉTRICAS DE SUCESSO**

#### **Testes**
- **Cobertura**: >80% de código
- **Testes E2E**: >95% dos fluxos críticos
- **CI/CD**: 100% dos PRs testados
- **Tempo de Build**: <5 minutos

#### **Monitoramento**
- **Uptime**: >99.9%
- **Error Rate**: <0.1%
- **Response Time**: <500ms p95
- **Core Web Vitals**: 100% verde

#### **Cache**
- **Cache Hit Rate**: >80%
- **Page Load Time**: <2s
- **API Response Time**: <200ms
- **CDN Hit Rate**: >90%

### 🔍 **VALIDAÇÃO E TESTES**

#### **Checklist de Validação**
- [ ] Todos os testes passando (unit + integration + E2E)
- [ ] Lighthouse score >90
- [ ] Sentry configurado e funcionando
- [ ] Google Analytics 4 ativo
- [ ] Redis cache funcionando
- [ ] Vercel Edge Cache ativo
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Performance otimizada
- [ ] Security headers implementados

#### **Testes de Carga**
- Simular 1000 usuários simultâneos
- Testar cache sob carga
- Validar performance com monitoramento

### 📝 **ENTREGÁVEIS ESPERADOS**

1. **Código Implementado**:
   - Testes completos em `__tests__/`
   - Configurações de monitoramento
   - Sistema de cache funcional

2. **Documentação**:
   - README atualizado com instruções
   - Guia de testes para desenvolvedores
   - Documentação de monitoramento

3. **Configurações**:
   - GitHub Actions para CI/CD
   - Configurações de ambiente
   - Scripts de deploy

4. **Dashboards**:
   - Página de monitoramento em `/admin/monitoring`
   - Métricas de performance
   - Alertas configurados

### ⚠️ **CONSIDERAÇÕES IMPORTANTES**

#### **Compatibilidade**
- Manter compatibilidade com Next.js 14
- Não quebrar funcionalidades existentes
- Preservar design atual

#### **Performance**
- Não impactar negativamente a performance
- Otimizar para mobile
- Considerar conexões lentas

#### **Manutenibilidade**
- Código limpo e documentado
- Configurações centralizadas
- Fácil de manter e expandir

### 🎯 **PRÓXIMAS FASES**

Após completar a Fase 1, as próximas fases incluirão:
- **Fase 2**: Segurança e Performance Avançada
- **Fase 3**: Funcionalidades Avançadas (PWA completo, i18n)
- **Fase 4**: Otimizações e Escalabilidade

### 📞 **SUPORTE E COMUNICAÇÃO**

- **Status Updates**: Diários via GitHub Issues
- **Dúvidas**: Criar issue com label `question`
- **Bugs**: Criar issue com label `bug`
- **Melhorias**: Criar issue com label `enhancement`

---

**🚀 INSTRUÇÕES FINAIS**: Implemente as melhorias seguindo exatamente este prompt, mantendo a qualidade e padrões especificados. Priorize a estabilidade e não quebre funcionalidades existentes. Documente todas as mudanças e crie testes abrangentes.

**Status**: ✅ Pronto para implementação
**Prioridade**: 🔴 ALTA
**Estimativa**: 3 semanas
**Complexidade**: Média-Alta
