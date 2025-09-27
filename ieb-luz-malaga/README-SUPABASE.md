# Migração para Supabase - Guia de Configuração

## Passos para Configurar o Supabase

### 1. Criar Conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

### 2. Configurar Variáveis de Ambiente
1. Copie o arquivo `env.example` para `.env.local`
2. Preencha as variáveis com os dados do seu projeto Supabase:

```bash
# Obtenha estes dados no painel do Supabase > Settings > Database
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJECT-REF].supabase.co:5432/postgres"

# Obtenha estes dados no painel do Supabase > Settings > API
NEXT_PUBLIC_SUPABASE_URL="https://[SEU-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[SUA-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SUA-SERVICE-ROLE-KEY]"

# Gere uma chave secreta para NextAuth
NEXTAUTH_SECRET="[SUA-CHAVE-SECRETA]"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Executar Migrações
```bash
# Gerar o cliente Prisma
npm run db:generate

# Aplicar as migrações no banco
npm run db:push

# (Opcional) Executar seed com dados de exemplo
npm run db:seed
```

### 5. Verificar Configuração
```bash
# Abrir Prisma Studio para visualizar os dados
npm run db:studio
```

## Benefícios da Migração

✅ **Banco PostgreSQL Gerenciado** - Sem necessidade de configurar servidor  
✅ **500MB de armazenamento gratuito** - Suficiente para uma igreja pequena/média  
✅ **Autenticação integrada** - Sistema de login pronto  
✅ **Armazenamento de arquivos** - Para vídeos de sermões e fotos  
✅ **APIs em tempo real** - Atualizações automáticas  
✅ **Backup automático** - Seus dados estão seguros  

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Gerar cliente Prisma após mudanças no schema
npm run db:generate

# Aplicar mudanças no banco
npm run db:push

# Criar nova migração
npm run db:migrate

# Visualizar dados no navegador
npm run db:studio

# Executar seed
npm run db:seed
```

## Próximos Passos

1. Configure as variáveis de ambiente
2. Execute as migrações
3. Teste a aplicação localmente
4. Configure autenticação com Supabase Auth (opcional)
5. Configure armazenamento de arquivos (opcional)
