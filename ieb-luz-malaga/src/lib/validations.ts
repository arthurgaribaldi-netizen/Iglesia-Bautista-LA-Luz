import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>

// Event form validation schema
export const eventFormSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  location: z.string().min(5, "Local deve ter pelo menos 5 caracteres"),
  type: z.enum(["culto", "estudio", "evento", "oracao"]),
});

export type EventFormData = z.infer<typeof eventFormSchema>

// Sermon form validation schema
export const sermonFormSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  speaker: z.string().min(2, "Nome do pregador deve ter pelo menos 2 caracteres"),
  date: z.string().min(1, "Data é obrigatória"),
  duration: z.number().min(1, "Duração deve ser pelo menos 1 minuto"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres").optional(),
  audioUrl: z.string().url("URL do áudio inválida").optional(),
  videoUrl: z.string().url("URL do vídeo inválida").optional(),
});

export type SermonFormData = z.infer<typeof sermonFormSchema>

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
});

export type NewsletterData = z.infer<typeof newsletterSchema>