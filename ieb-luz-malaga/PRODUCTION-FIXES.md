# Correções para Problemas de Produção

## Problemas Identificados

### 1. **Variáveis de Ambiente Faltando**
O site não carrega porque as seguintes variáveis de ambiente não estão configuradas no Vercel:

#### Variáveis Obrigatórias:
```env
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_SITE_URL=https://ieblaluzmalaga.vercel.app
YOUTUBE_API_KEY=sua-chave-da-api-do-youtube
```

#### Variáveis Opcionais (mas recomendadas):
```env
NEXTAUTH_URL=https://ieblaluzmalaga.vercel.app
NEXTAUTH_SECRET=seu-secret-key-aqui
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua-chave-do-google-maps
GOOGLE_SITE_VERIFICATION=codigo-de-verificacao-do-google
```

### 2. **Problemas de Build**
- Componentes que fazem chamadas para APIs externas podem estar falhando
- Falta de tratamento de erro adequado para APIs que falham

### 3. **Dependências do Banco de Dados**
- O Prisma precisa de uma conexão válida com PostgreSQL
- Migrações podem não ter sido executadas

## Soluções Imediatas

### Passo 1: Configurar Variáveis de Ambiente no Vercel

1. Acesse o painel do Vercel
2. Vá para o projeto "ieblaluzmalaga"
3. Clique em "Settings" → "Environment Variables"
4. Adicione as variáveis obrigatórias listadas acima
5. Faça um novo deploy

### Passo 2: Configurar Banco de Dados

Se você não tem um banco PostgreSQL configurado:

1. **Opção A - Supabase (Recomendado):**
   - Crie uma conta no Supabase
   - Crie um novo projeto
   - Copie a URL de conexão
   - Configure como `DATABASE_URL`

2. **Opção B - Vercel Postgres:**
   - No painel do Vercel, vá para "Storage"
   - Crie um banco Postgres
   - Use a URL fornecida

### Passo 3: Executar Migrações

Após configurar o banco, execute:
```bash
npx prisma db push
npx prisma generate
```

### Passo 4: Configurar YouTube API (Opcional)

1. Acesse Google Cloud Console
2. Ative a YouTube Data API v3
3. Crie uma chave de API
4. Configure como `YOUTUBE_API_KEY`

## Correções de Código

### 1. Melhorar Tratamento de Erros na API

O arquivo `/src/app/api/devotionals/route.ts` já tem tratamento de erro adequado.

### 2. Adicionar Fallback para APIs Externas

O arquivo `/src/app/api/youtube/videos/route.ts` já retorna dados mockados quando a API falha.

### 3. Verificar Componentes Críticos

Os componentes `DailyDevotional` e `DailyVerse` têm tratamento de erro e loading states adequados.

## Checklist de Verificação

- [ ] Configurar `DATABASE_URL` no Vercel
- [ ] Configurar `NEXT_PUBLIC_SITE_URL` no Vercel
- [ ] Configurar `YOUTUBE_API_KEY` no Vercel (opcional)
- [ ] Executar migrações do banco de dados
- [ ] Fazer novo deploy
- [ ] Testar o site em produção

## URLs de Teste

Após as correções, teste estas URLs:
- https://ieblaluzmalaga.vercel.app/
- https://ieblaluzmalaga.vercel.app/api/devotionals
- https://ieblaluzmalaga.vercel.app/api/youtube/videos

## Próximos Passos

1. **Imediato**: Configurar variáveis de ambiente
2. **Curto prazo**: Configurar banco de dados
3. **Médio prazo**: Adicionar monitoramento de erros
4. **Longo prazo**: Implementar cache Redis para melhor performance

## Contato para Suporte

Se precisar de ajuda com a configuração:
- Verificar logs do Vercel em "Functions" → "Logs"
- Verificar métricas em "Analytics"
- Usar o painel de administração em `/admin` (após configurar autenticação)
