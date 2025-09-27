# Configuração da API do YouTube

Este guia explica como configurar a integração com o canal do YouTube da IEB La Luz Málaga.

## Canal da Igreja
- **URL**: https://www.youtube.com/channel/UCiahUfyUv3VbwrMjgLh-WzA
- **ID do Canal**: `UCiahUfyUv3VbwrMjgLh-WzA`

## Como Obter uma Chave da API do YouTube

### 1. Acesse o Google Cloud Console
1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Crie um novo projeto ou selecione um existente

### 2. Ative a YouTube Data API v3
1. No menu lateral, vá para **APIs & Services** > **Library**
2. Procure por "YouTube Data API v3"
3. Clique em **Enable**

### 3. Criar Credenciais
1. Vá para **APIs & Services** > **Credentials**
2. Clique em **Create Credentials** > **API Key**
3. Copie a chave gerada
4. (Opcional) Configure restrições de API para maior segurança

### 4. Configurar no Projeto
1. Crie ou edite o arquivo `.env.local` na raiz do projeto
2. Adicione a linha:
```env
YOUTUBE_API_KEY="sua-chave-da-api-aqui"
```

## Funcionalidades Implementadas

### Player de Vídeo Integrado
- **Player principal**: Exibe o vídeo mais recente ou transmissão ao vivo
- **Lista de vídeos**: Mostra os últimos vídeos do canal
- **Detecção de transmissões ao vivo**: Identifica automaticamente quando há uma transmissão ao vivo
- **Informações do vídeo**: Título, descrição, data de publicação e duração

### Recursos do Player
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Modo escuro**: Suporte completo ao tema escuro
- **Navegação**: Permite alternar entre diferentes vídeos
- **Links externos**: Botões para assistir no YouTube

### API Endpoints
- `GET /api/youtube/videos?channelId=UCiahUfyUv3VbwrMjgLh-WzA`
  - Retorna lista de vídeos do canal
  - Prioriza transmissões ao vivo
  - Inclui informações detalhadas de cada vídeo

## Limitações da API Gratuita
- **Quota diária**: 10.000 unidades por dia
- **Custo por requisição**: 
  - Lista de vídeos: 1 unidade
  - Detalhes do vídeo: 1 unidade por vídeo
- **Rate limiting**: Máximo 100 requisições por 100 segundos

## Fallback para Desenvolvimento
Se a API do YouTube não estiver configurada ou falhar, o sistema usa dados mock para desenvolvimento, permitindo que você veja como a interface funcionará.

## Monitoramento
Para monitorar o uso da API:
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para **APIs & Services** > **Dashboard**
3. Selecione a YouTube Data API v3
4. Visualize métricas de uso e quota

## Troubleshooting

### Erro: "YouTube API key not configured"
- Verifique se a variável `YOUTUBE_API_KEY` está definida no `.env.local`
- Reinicie o servidor de desenvolvimento após adicionar a variável

### Erro: "Channel not found"
- Verifique se o ID do canal está correto: `UCiahUfyUv3VbwrMjgLh-WzA`
- Confirme se a API está habilitada no Google Cloud Console

### Erro: "Quota exceeded"
- Você atingiu o limite diário de requisições
- Aguarde até o próximo dia ou considere aumentar a quota

## Segurança
- **Nunca commite** a chave da API no repositório
- Use restrições de API no Google Cloud Console
- Considere usar um proxy para esconder a chave no frontend (se necessário)
