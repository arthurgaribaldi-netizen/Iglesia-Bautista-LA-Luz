# 📊 Sistema de Monitoramento - IEB La Luz Málaga

## Configuração

### 1. Variáveis de Ambiente
Copie `.env.example` para `.env.local` e configure:
- `NEXT_PUBLIC_SENTRY_DSN`: DSN do Sentry
- `NEXT_PUBLIC_GA_ID`: ID do Google Analytics

### 2. Dashboard
Acesse `/admin/monitoring` para ver métricas em tempo real.

### 3. Logs
- Logs gerais: `logs/combined-YYYY-MM-DD.log`
- Logs de erro: `logs/error-YYYY-MM-DD.log`

## Métricas Monitoradas

- **Performance**: LCP, FID, CLS, FCP, TTFB
- **Errors**: Total, críticos, resolvidos, novos
- **Traffic**: Page views, visitantes únicos, bounce rate
- **Uptime**: Disponibilidade atual e histórica

## Alertas

- LCP > 2.5s: Alerta de performance
- Erros > 10/hora: Alerta crítico
- Uptime < 99.5%: Alerta crítico

## Scripts Disponíveis

```bash
# Setup inicial
npm run setup:monitoring

# Visualizar logs
npm run logs:view
npm run logs:error
```

## Estrutura de Arquivos

```
src/
├── components/
│   ├── analytics/
│   │   ├── google-analytics.tsx
│   │   └── performance-monitor.tsx
│   └── admin/
│       └── metrics-dashboard.tsx
├── hooks/
│   └── use-web-vitals.ts
├── lib/
│   ├── alerts.ts
│   └── logger.ts
└── app/
    ├── api/admin/
    │   ├── metrics/route.ts
    │   └── alerts/route.ts
    └── admin/monitoring/page.tsx
```

## Troubleshooting

### Sentry não está funcionando
1. Verifique se `NEXT_PUBLIC_SENTRY_DSN` está configurado
2. Verifique se `SENTRY_ORG` e `SENTRY_PROJECT` estão corretos
3. Verifique se o projeto está configurado no Sentry

### Google Analytics não está coletando dados
1. Verifique se `NEXT_PUBLIC_GA_ID` está configurado
2. Verifique se o ID do GA4 está correto
3. Aguarde até 24 horas para ver dados no GA4

### Dashboard não carrega
1. Verifique se você está logado como admin
2. Verifique se as APIs estão funcionando
3. Verifique os logs de erro no console
