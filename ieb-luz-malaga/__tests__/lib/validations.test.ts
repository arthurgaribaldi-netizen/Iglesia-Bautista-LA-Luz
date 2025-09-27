import { 
  contactFormSchema, 
  eventFormSchema, 
  sermonFormSchema, 
  newsletterSchema 
} from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('contactFormSchema', () => {
    it('should validate correct contact form data', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '123456789',
        subject: 'Dúvida sobre eventos',
        message: 'Gostaria de saber mais sobre os eventos da igreja.'
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'João Silva',
        email: 'email-invalido',
        subject: 'Dúvida sobre eventos',
        message: 'Gostaria de saber mais sobre os eventos da igreja.'
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido');
      }
    });

    it('should reject short name', () => {
      const invalidData = {
        name: 'J',
        email: 'joao@email.com',
        subject: 'Dúvida sobre eventos',
        message: 'Gostaria de saber mais sobre os eventos da igreja.'
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome deve ter pelo menos 2 caracteres');
      }
    });

    it('should reject short subject', () => {
      const invalidData = {
        name: 'João Silva',
        email: 'joao@email.com',
        subject: 'Dúvida',
        message: 'Gostaria de saber mais sobre os eventos da igreja.'
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Assunto deve ter pelo menos 5 caracteres');
      }
    });

    it('should reject short message', () => {
      const invalidData = {
        name: 'João Silva',
        email: 'joao@email.com',
        subject: 'Dúvida sobre eventos',
        message: 'Pergunta'
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mensagem deve ter pelo menos 10 caracteres');
      }
    });

    it('should accept data without phone', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@email.com',
        subject: 'Dúvida sobre eventos',
        message: 'Gostaria de saber mais sobre os eventos da igreja.'
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('eventFormSchema', () => {
    it('should validate correct event form data', () => {
      const validData = {
        title: 'Culto de Celebração',
        description: 'Um momento especial de adoração e comunhão com Deus.',
        date: '2024-02-15',
        time: '19:00',
        location: 'Igreja Bautista La Luz',
        type: 'culto' as const
      };

      const result = eventFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid event type', () => {
      const invalidData = {
        title: 'Culto de Celebração',
        description: 'Um momento especial de adoração e comunhão com Deus.',
        date: '2024-02-15',
        time: '19:00',
        location: 'Igreja Bautista La Luz',
        type: 'invalid-type'
      };

      const result = eventFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept all valid event types', () => {
      const validTypes = ['culto', 'estudio', 'evento', 'oracao'];
      
      validTypes.forEach(type => {
        const validData = {
          title: 'Título do Evento',
          description: 'Descrição detalhada do evento que será realizado.',
          date: '2024-02-15',
          time: '19:00',
          location: 'Igreja Bautista La Luz',
          type: type as const
        };

        const result = eventFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('sermonFormSchema', () => {
    it('should validate correct sermon form data', () => {
      const validData = {
        title: 'A Fé que Move Montanhas',
        speaker: 'Pastor João',
        date: '2024-02-15',
        duration: 45,
        description: 'Uma mensagem inspiradora sobre a importância da fé.',
        audioUrl: 'https://example.com/audio.mp3',
        videoUrl: 'https://youtube.com/watch?v=123'
      };

      const result = sermonFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid audio URL', () => {
      const invalidData = {
        title: 'A Fé que Move Montanhas',
        speaker: 'Pastor João',
        date: '2024-02-15',
        duration: 45,
        audioUrl: 'not-a-valid-url'
      };

      const result = sermonFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('URL do áudio inválida');
      }
    });

    it('should reject duration less than 1 minute', () => {
      const invalidData = {
        title: 'A Fé que Move Montanhas',
        speaker: 'Pastor João',
        date: '2024-02-15',
        duration: 0
      };

      const result = sermonFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Duração deve ser pelo menos 1 minuto');
      }
    });

    it('should accept sermon without optional fields', () => {
      const validData = {
        title: 'A Fé que Move Montanhas',
        speaker: 'Pastor João',
        date: '2024-02-15',
        duration: 45
      };

      const result = sermonFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('newsletterSchema', () => {
    it('should validate correct newsletter subscription', () => {
      const validData = {
        email: 'usuario@email.com',
        name: 'João Silva'
      };

      const result = newsletterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept subscription without name', () => {
      const validData = {
        email: 'usuario@email.com'
      };

      const result = newsletterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'email-invalido'
      };

      const result = newsletterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido');
      }
    });

    it('should reject short name when provided', () => {
      const invalidData = {
        email: 'usuario@email.com',
        name: 'J'
      };

      const result = newsletterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome deve ter pelo menos 2 caracteres');
      }
    });
  });
});
