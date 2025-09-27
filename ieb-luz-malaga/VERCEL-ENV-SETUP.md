# Configuração de Variáveis de Ambiente no Vercel

Para resolver o erro 404 na produção, você precisa configurar as seguintes variáveis de ambiente no painel do Vercel:

## Variáveis Obrigatórias

### 1. DATABASE_URL
```
DATABASE_URL=postgresql://username:password@host:port/database
```
**Importante**: Esta variável é obrigatória para o funcionamento da aplicação.

### 2. NEXT_PUBLIC_SITE_URL
```
NEXT_PUBLIC_SITE_URL=https://iglesia-bautista-la-luz.vercel.app
```

### 3. NEXTAUTH_URL
```
NEXTAUTH_URL=https://iglesia-bautista-la-luz.vercel.app
```

### 4. NEXTAUTH_SECRET
```
NEXTAUTH_SECRET=seu-secret-key-aqui
```

## Variáveis Opcionais (mas recomendadas)

### YouTube API
```
YOUTUBE_API_KEY=sua-chave-da-api-do-youtube
```

### Google Maps API
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua-chave-do-google-maps
```

### Google Site Verification
```
GOOGLE_SITE_VERIFICATION=codigo-de-verificacao-do-google
```

## Como Configurar no Vercel

1. Acesse o painel do Vercel
2. Vá para o projeto "iglesia-bautista-la-luz"
3. Clique em "Settings"
4. Vá para "Environment Variables"
5. Adicione cada variável acima
6. Faça um novo deploy

## Problemas Identificados e Corrigidos

1. ✅ **Erro Tailwind CSS**: Corrigido `border-gray-800` para `border-gray-700`
2. ✅ **Erro API YouTube**: Removido uso dinâmico de `searchParams` para permitir geração estática
3. ✅ **Configuração Vercel**: Criado arquivo `vercel.json` com configurações adequadas
4. ⚠️ **Variável DATABASE_URL**: Precisa ser configurada no Vercel

## Próximos Passos

1. Configure as variáveis de ambiente no Vercel
2. Faça um novo deploy
3. Teste o site em produção
