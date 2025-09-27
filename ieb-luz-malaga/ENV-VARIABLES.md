# Variáveis de Ambiente Necessárias

Para que o projeto funcione corretamente, você precisa criar um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

## Database
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ieb_luz_malaga"
```

## NextAuth.js (se usando autenticação)
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Supabase (se usando)
```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

## Email (se usando serviço de email)
```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

## YouTube API (para integração com canal da igreja)
```env
YOUTUBE_API_KEY="your-youtube-api-key-here"
```

## Google Maps API (para mapas e localização)
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key-here"
```

## Instruções

1. Copie este arquivo para `.env.local`
2. Substitua os valores pelos seus dados reais
3. Nunca commite o arquivo `.env.local` para o repositório
4. O arquivo `.env.local` já está no `.gitignore`
