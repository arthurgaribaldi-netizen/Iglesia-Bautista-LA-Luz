/**
 * Sistema padronizado de mensagens de erro para melhorar a UX
 * Centraliza todas as mensagens de erro, sucesso e validação
 */

export type ErrorType = 
  | 'validation'
  | 'network' 
  | 'auth'
  | 'permission'
  | 'notFound'
  | 'server'
  | 'upload'
  | 'unknown'

export type MessageType = 'error' | 'success' | 'warning' | 'info'

export interface ErrorMessage {
  type: MessageType
  category: ErrorType
  title: string
  message: string
  action?: string
  code?: string
}

// Mensagens de validação
export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} é obrigatório`,
  invalidEmail: 'Email inválido',
  invalidPhone: 'Telefone inválido',
  minLength: (field: string, min: number) => `${field} deve ter pelo menos ${min} caracteres`,
  maxLength: (field: string, max: number) => `${field} deve ter no máximo ${max} caracteres`,
  invalidNumber: (field: string) => `${field} deve ser um número válido`,
  invalidDate: (field: string) => `${field} deve ser uma data válida`,
  invalidTime: (field: string) => `${field} deve ser um horário válido`,
  invalidUrl: 'URL inválida',
  invalidFileType: (allowedTypes: string[]) => `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`,
  fileTooLarge: (maxSize: string) => `Arquivo muito grande. Tamanho máximo: ${maxSize}`,
} as const

// Mensagens de erro por categoria
export const ERROR_MESSAGES: Record<string, ErrorMessage> = {
  // Erros de rede
  NETWORK_ERROR: {
    type: 'error',
    category: 'network',
    title: 'Erro de conexão',
    message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
    action: 'Tentar novamente',
    code: 'NETWORK_ERROR'
  },
  
  TIMEOUT_ERROR: {
    type: 'error',
    category: 'network',
    title: 'Tempo limite excedido',
    message: 'A operação demorou mais que o esperado. Tente novamente.',
    action: 'Tentar novamente',
    code: 'TIMEOUT_ERROR'
  },

  // Erros de autenticação
  UNAUTHORIZED: {
    type: 'error',
    category: 'auth',
    title: 'Acesso negado',
    message: 'Você precisa fazer login para acessar esta área.',
    action: 'Fazer login',
    code: 'UNAUTHORIZED'
  },

  INVALID_CREDENTIALS: {
    type: 'error',
    category: 'auth',
    title: 'Login inválido',
    message: 'Email ou senha incorretos. Verifique suas credenciais.',
    action: 'Tentar novamente',
    code: 'INVALID_CREDENTIALS'
  },

  SESSION_EXPIRED: {
    type: 'warning',
    category: 'auth',
    title: 'Sessão expirada',
    message: 'Sua sessão expirou. Faça login novamente para continuar.',
    action: 'Fazer login',
    code: 'SESSION_EXPIRED'
  },

  // Erros de permissão
  FORBIDDEN: {
    type: 'error',
    category: 'permission',
    title: 'Acesso restrito',
    message: 'Você não tem permissão para realizar esta ação.',
    action: 'Voltar',
    code: 'FORBIDDEN'
  },

  // Erros de recurso não encontrado
  NOT_FOUND: {
    type: 'error',
    category: 'notFound',
    title: 'Recurso não encontrado',
    message: 'O item que você está procurando não foi encontrado.',
    action: 'Voltar',
    code: 'NOT_FOUND'
  },

  // Erros do servidor
  SERVER_ERROR: {
    type: 'error',
    category: 'server',
    title: 'Erro interno',
    message: 'Ocorreu um erro interno no servidor. Nossa equipe foi notificada.',
    action: 'Tentar novamente',
    code: 'SERVER_ERROR'
  },

  MAINTENANCE: {
    type: 'warning',
    category: 'server',
    title: 'Sistema em manutenção',
    message: 'O sistema está temporariamente indisponível para manutenção.',
    action: 'Tentar mais tarde',
    code: 'MAINTENANCE'
  },

  // Erros de upload
  UPLOAD_FAILED: {
    type: 'error',
    category: 'upload',
    title: 'Falha no upload',
    message: 'Não foi possível enviar o arquivo. Verifique o tamanho e formato.',
    action: 'Tentar novamente',
    code: 'UPLOAD_FAILED'
  },

  UPLOAD_TOO_LARGE: {
    type: 'error',
    category: 'upload',
    title: 'Arquivo muito grande',
    message: 'O arquivo excede o tamanho máximo permitido.',
    action: 'Escolher outro arquivo',
    code: 'UPLOAD_TOO_LARGE'
  },

  UPLOAD_INVALID_TYPE: {
    type: 'error',
    category: 'upload',
    title: 'Tipo de arquivo inválido',
    message: 'O tipo de arquivo não é permitido.',
    action: 'Escolher outro arquivo',
    code: 'UPLOAD_INVALID_TYPE'
  },

  // Erro genérico
  UNKNOWN_ERROR: {
    type: 'error',
    category: 'unknown',
    title: 'Erro inesperado',
    message: 'Ocorreu um erro inesperado. Tente novamente.',
    action: 'Tentar novamente',
    code: 'UNKNOWN_ERROR'
  }
} as const

// Mensagens de sucesso
export const SUCCESS_MESSAGES: Record<string, ErrorMessage> = {
  SAVED: {
    type: 'success',
    category: 'validation',
    title: 'Salvo com sucesso',
    message: 'As informações foram salvas com sucesso.',
    code: 'SAVED'
  },

  DELETED: {
    type: 'success',
    category: 'validation',
    title: 'Excluído com sucesso',
    message: 'O item foi excluído com sucesso.',
    code: 'DELETED'
  },

  UPDATED: {
    type: 'success',
    category: 'validation',
    title: 'Atualizado com sucesso',
    message: 'As informações foram atualizadas com sucesso.',
    code: 'UPDATED'
  },

  CREATED: {
    type: 'success',
    category: 'validation',
    title: 'Criado com sucesso',
    message: 'O item foi criado com sucesso.',
    code: 'CREATED'
  },

  UPLOADED: {
    type: 'success',
    category: 'upload',
    title: 'Upload realizado',
    message: 'O arquivo foi enviado com sucesso.',
    code: 'UPLOADED'
  },

  LOGIN_SUCCESS: {
    type: 'success',
    category: 'auth',
    title: 'Login realizado',
    message: 'Login realizado com sucesso.',
    code: 'LOGIN_SUCCESS'
  },

  LOGOUT_SUCCESS: {
    type: 'success',
    category: 'auth',
    title: 'Logout realizado',
    message: 'Você foi desconectado com sucesso.',
    code: 'LOGOUT_SUCCESS'
  }
} as const

// Funções utilitárias
export function getErrorMessage(key: string): ErrorMessage {
  return ERROR_MESSAGES[key] || ERROR_MESSAGES.UNKNOWN_ERROR
}

export function getSuccessMessage(key: string): ErrorMessage {
  return SUCCESS_MESSAGES[key] || SUCCESS_MESSAGES.SAVED
}

export function createValidationError(field: string, rule: keyof typeof VALIDATION_MESSAGES, ...args: any[]): ErrorMessage {
  const message = typeof VALIDATION_MESSAGES[rule] === 'function' 
    ? (VALIDATION_MESSAGES[rule] as Function)(...args)
    : VALIDATION_MESSAGES[rule]

  return {
    type: 'error',
    category: 'validation',
    title: 'Dados inválidos',
    message: `${field}: ${message}`,
    code: 'VALIDATION_ERROR'
  }
}

// Mapeamento de códigos de status HTTP para mensagens
export const HTTP_ERROR_MAP: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  408: 'TIMEOUT_ERROR',
  413: 'UPLOAD_TOO_LARGE',
  415: 'UPLOAD_INVALID_TYPE',
  429: 'RATE_LIMIT',
  500: 'SERVER_ERROR',
  502: 'NETWORK_ERROR',
  503: 'MAINTENANCE',
  504: 'TIMEOUT_ERROR'
}

export function getErrorMessageFromStatus(status: number): ErrorMessage {
  const errorKey = HTTP_ERROR_MAP[status] || 'UNKNOWN_ERROR'
  return getErrorMessage(errorKey)
}

// Mensagens específicas por contexto
export const CONTEXT_MESSAGES = {
  // Eventos
  EVENT_SAVE_ERROR: 'Erro ao salvar evento',
  EVENT_DELETE_ERROR: 'Erro ao excluir evento',
  EVENT_LOAD_ERROR: 'Erro ao carregar eventos',
  
  // Sermões
  SERMON_SAVE_ERROR: 'Erro ao salvar sermão',
  SERMON_DELETE_ERROR: 'Erro ao excluir sermão',
  SERMON_LOAD_ERROR: 'Erro ao carregar sermões',
  
  // Contatos
  CONTACT_LOAD_ERROR: 'Erro ao carregar contatos',
  CONTACT_DELETE_ERROR: 'Erro ao excluir contato',
  CONTACT_MARK_READ_ERROR: 'Erro ao marcar como lido',
  CONTACT_MARK_UNREAD_ERROR: 'Erro ao marcar como não lido',
  
  // Recursos
  RESOURCE_SAVE_ERROR: 'Erro ao salvar recurso',
  RESOURCE_DELETE_ERROR: 'Erro ao excluir recurso',
  RESOURCE_LOAD_ERROR: 'Erro ao carregar recursos',
  
  // Links
  LINK_SAVE_ERROR: 'Erro ao salvar link',
  LINK_DELETE_ERROR: 'Erro ao excluir link',
  LINK_LOAD_ERROR: 'Erro ao carregar links',
  
  // Configurações
  CONFIG_SAVE_ERROR: 'Erro ao salvar configurações',
  CONFIG_LOAD_ERROR: 'Erro ao carregar configurações',
  
  // Dashboard
  DASHBOARD_LOAD_ERROR: 'Erro ao carregar dados do dashboard'
} as const
