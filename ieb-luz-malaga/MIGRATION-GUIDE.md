# Guia de Migração de Dados - IEB La Luz Málaga

Este guia explica como migrar os dados do site original (https://ieblaluzmalaga.es/) para o novo sistema baseado em dados reais.

## 🎯 Objetivo

Substituir os dados fictícios (mock data) por informações reais da Igreja Evangélica Bautista La Luz Málaga, conectando o site ao banco de dados real.

## 📋 Pré-requisitos

1. **Banco de dados configurado**: Supabase ou PostgreSQL
2. **Variáveis de ambiente**: `DATABASE_URL` configurada
3. **Dependências instaladas**: `npm install`

## 🚀 Passos para Migração

### 1. Configurar o Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar migrações
npm run db:push
```

### 2. Executar Migração de Dados

```bash
# Executar script de migração
npm run db:seed
```

Este comando irá:
- ✅ Criar usuário administrador padrão
- ✅ Migrar versículos bíblicos do site original
- ✅ Criar eventos regulares baseados nos horários da igreja
- ✅ Adicionar sermões de exemplo contextualizados
- ✅ Migrar recursos espirituais mencionados no site
- ✅ Incluir links úteis da igreja
- ✅ Criar informações oficiais da igreja

### 3. Verificar Migração

```bash
# Abrir Prisma Studio para visualizar dados
npm run db:studio
```

## 📊 Dados Migrados

### Informações da Igreja
- **Nome**: Iglesia Evangélica Bautista La Luz
- **Localização**: Málaga, España
- **CIF**: R2900286B
- **Ministério de Justicia**: nº 016332

### Horários Regulares
- **Domingo 11:00**: Estudio Bíblico y Escuela Dominical (Presencial)
- **Domingo 18:00**: Culto de la Tarde (Transmisión en directo)

### Recursos Espirituais
- La Buena Semilla (Devocional)
- Guía UMMBE (Estudo Bíblico)
- Revista Unidos UEBE
- Pastor Rick's (Recursos do Pastor)

### Links Úteis
- Unión Evangélica Bautista de España (UEBE)
- Facultad Protestante de Teología
- FEREDE
- Actualidad Evangélica
- Alianza Evangélica Española
- Buenas Noticias TV
- El Eco Bautista
- Salvación en Cristo

### Versículos Bíblicos
- Hebreos 10:24-25 (sobre congregar-se)
- Proverbios 21:25 (sobre trabalho)
- Ezequiel 25:15 (sobre justiça divina)

## 🔧 Estrutura do Banco de Dados

### Modelos Principais

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(MEMBER)
  createdAt DateTime @default(now())
  
  sermons   Sermon[]
  events    Event[]
}

model Sermon {
  id          String   @id @default(cuid())
  title       String
  pastor      String
  date        DateTime
  audioUrl    String?
  videoUrl    String?
  transcript  String?
  series      String?
  description String?
  createdAt   DateTime @default(now())
  
  author      User     @relation(fields: [authorId], references: [id])
  authorId    String
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime?
  location    String?
  capacity    Int?
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  organizer   User     @relation(fields: [organizerId], references: [id])
  organizerId String
}

model SpiritualResource {
  id          String   @id @default(cuid())
  title       String
  description String?
  type        String
  category    String?
  url         String?
  downloadUrl String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model UsefulLink {
  id          String   @id @default(cuid())
  title       String
  url         String
  description String?
  category    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model ChurchInfo {
  id              String   @id @default(cuid())
  name            String
  location        String
  cif             String?
  ministryNumber  String?
  email           String?
  phone           String?
  address         String?
  website         String?
  youtubeChannel  String?
  facebookPage    String?
  instagramPage   String?
  updatedAt       DateTime @updatedAt
  createdAt       DateTime @default(now())
}
```

## 🎨 Páginas Atualizadas

### 1. Sermões (`/sermoes`)
- ✅ Conectada à API `/api/sermons`
- ✅ Busca funcional por título, pastor ou série
- ✅ Estados de loading e erro
- ✅ Dados reais do banco de dados

### 2. Eventos (`/eventos`)
- ✅ Conectada à API `/api/events`
- ✅ Filtro para eventos futuros
- ✅ Estados de loading e erro
- ✅ Dados reais do banco de dados

### 3. Recursos (`/recursos`)
- ✅ Busca bíblica funcional (`/api/bible/search`)
- ✅ Recursos espirituais (`/api/resources`)
- ✅ Links úteis (`/api/links`)
- ✅ Estados de loading e erro

## 🔄 Próximos Passos

### 1. Integração com YouTube
- Conectar com canal oficial da igreja
- Importar sermões em vídeo automaticamente
- Sincronizar transmissões ao vivo

### 2. Painel Administrativo
- Interface para gerenciar sermões
- Sistema de upload de áudio/vídeo
- Gestão de eventos e recursos

### 3. Funcionalidades Avançadas
- Sistema de notificações
- Newsletter automático
- Integração com redes sociais

## 🐛 Resolução de Problemas

### Erro de Conexão com Banco
```bash
# Verificar variáveis de ambiente
echo $DATABASE_URL

# Regenerar cliente Prisma
npm run db:generate
```

### Dados Não Aparecem
```bash
# Verificar se a migração foi executada
npm run db:seed

# Verificar dados no Prisma Studio
npm run db:studio
```

### Erro de API
```bash
# Verificar se o servidor está rodando
npm run dev

# Verificar logs do servidor
# Procurar por erros no console
```

## 📞 Suporte

Para dúvidas ou problemas com a migração:

1. Verificar logs do console
2. Consultar documentação do Prisma
3. Verificar configuração do Supabase
4. Contatar administrador do sistema

---

**A DIOS SEA TODA LA GLORIA** ✨

*Este guia foi criado para facilitar a migração dos dados da IEB La Luz Málaga para o novo sistema baseado em dados reais.*
