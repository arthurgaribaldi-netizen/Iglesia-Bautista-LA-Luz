# 🚀 Instruções de Configuração - IEB La Luz Málaga

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL ou Supabase configurado
- Git instalado

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ieb_luz_malaga"

# JWT Secret Key (gere uma chave forte para produção)
JWT_SECRET="sua-chave-secreta-jwt-muito-forte"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-nextauth-secret"
```

### 3. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:push

# Popular com dados iniciais
npm run db:seed
```

### 4. Configurar Usuário Administrador

```bash
# Executar script de setup do admin
npx tsx scripts/setup-admin.ts
```

### 5. Iniciar Aplicação

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

## 🔐 Acesso Administrativo

Após a configuração inicial:

- **URL:** http://localhost:3000/admin
- **Email:** admin@ieblaluz.es
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere a senha padrão após o primeiro login!

## 📁 Estrutura do Projeto

```
src/
├── app/                 # Páginas Next.js
│   ├── admin/          # Interface administrativa
│   ├── api/            # Endpoints da API
│   └── ...             # Páginas públicas
├── components/         # Componentes React
├── lib/               # Utilitários e configurações
└── ...
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Iniciar em modo desenvolvimento
- `npm run build` - Construir para produção
- `npm run start` - Iniciar em modo produção
- `npm run lint` - Executar linter
- `npm run db:generate` - Gerar cliente Prisma
- `npm run db:push` - Sincronizar schema com banco
- `npm run db:migrate` - Executar migrações
- `npm run db:seed` - Popular banco com dados iniciais
- `npm run db:studio` - Abrir Prisma Studio

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT com expiração de 24h
- Cookies seguros configurados
- Validação de entrada com Zod
- Controle de acesso por roles

## 📞 Suporte

Para questões técnicas, consulte:
- `ADMIN-SYSTEM-GUIDE.md` - Guia do sistema administrativo
- `AUDIT-REPORT.md` - Relatório de auditoria
- `README.md` - Documentação principal

---

**Sistema configurado com sucesso!** 🎉
