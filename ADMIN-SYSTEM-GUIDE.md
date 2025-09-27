# 🏛️ Sistema Administrativo - Guia Completo

## 📋 Visão Geral

O sistema administrativo da IEB La Luz Málaga foi desenvolvido para ser **extremamente fácil de usar** por membros da igreja, sem necessidade de conhecimentos técnicos avançados.

## 🚀 Configuração Inicial

### 1. Primeiro Acesso

```bash
# Executar setup inicial
node scripts/setup-admin.js

# Ou acessar diretamente:
# http://localhost:3000/admin/login
```

**Credenciais Iniciais:**
- **Email:** admin@igreja.com
- **Senha:** admin123
- ⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

### 2. Estrutura do Sistema

```
/admin
├── 📊 Dashboard          - Visão geral do sistema
├── 📅 Eventos           - Gerenciar eventos e atividades
├── 📖 Sermões           - Upload e organização de sermões
├── 📚 Recursos          - Documentos e materiais espirituais
├── 🔗 Links Úteis       - Links importantes para a comunidade
├── 💬 Contatos          - Mensagens recebidas do site
├── 📈 Analytics         - Estatísticas do YouTube
├── 👥 Usuários          - Gerenciar usuários do sistema
└── ⚙️ Configurações     - Informações da igreja
```

## 🎯 Funcionalidades Principais

### 📅 Gerenciamento de Eventos

**Como criar um evento:**
1. Acesse "Eventos" no menu lateral
2. Clique em "Novo Evento"
3. Preencha:
   - Título do evento
   - Data e horário
   - Localização (opcional)
   - Descrição
   - Capacidade (opcional)
4. Clique em "Salvar Evento"

**Tipos de eventos comuns:**
- Cultos dominicais
- Estudos bíblicos
- Reuniões de oração
- Eventos especiais
- Atividades comunitárias

### 📖 Gerenciamento de Sermões

**Como adicionar um sermão:**
1. Acesse "Sermões" no menu lateral
2. Clique em "Novo Sermão"
3. Preencha:
   - Título do sermão
   - Nome do pastor/pregador
   - Data do sermão
   - Série (opcional)
   - Descrição
4. Faça upload de arquivos:
   - Áudio (MP3, WAV)
   - Vídeo (MP4, WebM)
5. Adicione transcrição (opcional)
6. Clique em "Salvar Sermão"

**Dicas importantes:**
- Use nomes descritivos para os arquivos
- Organize por séries para facilitar a busca
- Adicione transcrições para melhor acessibilidade

### 📚 Recursos Espirituais

**Como adicionar recursos:**
1. Acesse "Recursos" no menu lateral
2. Clique em "Novo Recurso"
3. Selecione o tipo:
   - Devocional
   - Guia de estudo
   - Material pastoral
   - Música
   - Vídeo
4. Defina a categoria (ex: Estudos Bíblicos, Família, etc.)
5. Adicione link ou arquivo para download

### 💬 Mensagens de Contato

**Como gerenciar contatos:**
1. Acesse "Contatos" no menu lateral
2. Visualize mensagens não lidas (marcadas em azul)
3. Clique em uma mensagem para ver detalhes
4. Use "Responder" para enviar email direto
5. Marque como lida quando processada

## 👥 Gerenciamento de Usuários

### Tipos de Usuários

- **ADMIN:** Acesso total ao sistema
- **EDITOR:** Pode criar/editar conteúdo (eventos, sermões, recursos)
- **MEMBER:** Acesso limitado (em desenvolvimento)

### Como adicionar usuários:

1. Acesse "Usuários" no menu lateral
2. Clique em "Novo Usuário"
3. Preencha email e nome
4. Selecione o nível de acesso
5. O usuário receberá instruções por email

## ⚙️ Configurações da Igreja

### Informações Básicas

**Como atualizar informações:**
1. Acesse "Configurações" no menu lateral
2. Clique em "Editar"
3. Atualize:
   - Nome da igreja
   - Endereço e contato
   - Redes sociais
   - Links importantes
4. Clique em "Salvar"

### Informações Importantes

- **Nome:** Iglesia Evangélica Bautista La Luz
- **CIF:** R2900286B
- **Ministério:** 016332
- **Endereço:** Avenida Antonio Gaudí, 4, 29004 Málaga, Espanha

## 🔧 Recursos Técnicos

### Upload de Arquivos

**Tipos suportados:**
- **Imagens:** JPEG, PNG, GIF, WebP (máx. 5MB)
- **Áudio:** MP3, WAV, OGG (máx. 50MB)
- **Vídeo:** MP4, WebM (máx. 200MB)
- **Documentos:** PDF, DOC, DOCX (máx. 10MB)

**Como fazer upload:**
1. Arraste o arquivo para a área de upload
2. Ou clique para selecionar
3. Aguarde o upload completar
4. O arquivo ficará disponível automaticamente

### Segurança

- Sistema de autenticação seguro
- Sessões com expiração automática
- Validação de tipos de arquivo
- Backup automático dos dados

## 📱 Interface Mobile

O sistema é totalmente responsivo e funciona em:
- 💻 Computadores
- 📱 Tablets
- 📱 Smartphones

## 🆘 Solução de Problemas

### Problemas Comuns

**1. Não consigo fazer login**
- Verifique se está usando as credenciais corretas
- Certifique-se de que o sistema está rodando
- Limpe o cache do navegador

**2. Upload não funciona**
- Verifique o tamanho do arquivo
- Confirme o tipo de arquivo suportado
- Verifique sua conexão com a internet

**3. Eventos não aparecem no site**
- Confirme que o evento está marcado como "Público"
- Verifique se a data está correta
- Aguarde alguns minutos para a atualização

### Contato Técnico

Para problemas técnicos, entre em contato com:
- **Email:** admin@igreja.com
- **Telefone:** +34 952 123 456

## 📚 Próximas Funcionalidades

- [ ] Sistema de notificações por email
- [ ] Backup automático dos dados
- [ ] Relatórios detalhados
- [ ] Integração com redes sociais
- [ ] App mobile para administradores

## 🎯 Dicas de Uso

### Para Pastores:
- Use o sistema para organizar sermões por séries
- Adicione transcrições para melhor acessibilidade
- Mantenha informações de contato atualizadas

### Para Secretários:
- Crie eventos com antecedência
- Use descrições claras e informativas
- Marque eventos como públicos ou privados conforme necessário

### Para Administradores:
- Faça backup regular dos dados
- Monitore o uso do sistema
- Mantenha as informações da igreja atualizadas

---

**Desenvolvido com ❤️ para a IEB La Luz Málaga**

*Sistema administrativo intuitivo e fácil de usar para toda a comunidade.*
